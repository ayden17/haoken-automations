export const TEXT_MODEL = "gemini-3.8-flash";

const IMAGE_MODELS = ["gemini-2.5-flash-image", "gemini-3.1-flash-image-preview"];

type GeminiPart = {
  text?: string;
  inlineData?: { mimeType?: string; data?: string };
};

type GeminiResponse = {
  error?: { message?: string };
  candidates?: { content?: { parts?: GeminiPart[] } }[];
};

export type GeneratedImage = {
  mimeType: string;
  data: string;
};

function redact(message: string, apiKey: string) {
  return message.replaceAll(apiKey, "[redacted]");
}

async function postModel(apiKey: string, model: string, body: unknown) {
  let response: Response | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(body),
      },
    );
    if (response.ok || (response.status !== 429 && response.status !== 503)) break;
    await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
  }
  return response;
}

function readPayload(data: GeminiResponse | null) {
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .map((part) => part.text || "")
    .join("")
    .trim();
  const imagePart = parts.find((part) => part.inlineData?.data);
  const image = imagePart?.inlineData?.data
    ? {
        mimeType: imagePart.inlineData.mimeType || "image/png",
        data: imagePart.inlineData.data,
      }
    : undefined;
  return { text, image };
}

export async function generateText(apiKey: string, prompt: string, maxOutputTokens = 1400) {
  const response = await postModel(apiKey, TEXT_MODEL, {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens },
  });
  if (!response) {
    return { error: "Could not reach the Gemini API.", status: 502 as const };
  }
  const data = (await response.json().catch(() => null)) as GeminiResponse | null;
  if (!response.ok) {
    const raw = redact(data?.error?.message || "Gemini rejected the request.", apiKey);
    const error =
      response.status === 429 || response.status === 503
        ? "Gemini is busy right now. Try again in a moment."
        : raw;
    return { error, status: response.status };
  }
  const { text } = readPayload(data);
  if (!text) {
    return { error: "Gemini returned an empty draft.", status: 502 as const };
  }
  return { text };
}

export async function generateImage(apiKey: string, prompt: string) {
  let lastError = "Gemini could not create an image.";
  let lastStatus = 502;
  for (const model of IMAGE_MODELS) {
    const response = await postModel(apiKey, model, {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
        temperature: 0.8,
      },
    });
    if (!response) continue;
    const data = (await response.json().catch(() => null)) as GeminiResponse | null;
    if (!response.ok) {
      lastStatus = response.status;
      lastError = redact(data?.error?.message || lastError, apiKey);
      continue;
    }
    const parsed = readPayload(data);
    if (parsed.image) return { text: parsed.text, image: parsed.image };
    lastError = "The image model returned no picture.";
  }
  if (lastStatus === 429 || lastStatus === 503) {
    const quota = /quota|billing/i.test(lastError);
    return {
      error: quota
        ? "Gemini image quota is used up for this key. Text drafts still work. Check the Gemini plan, then try the image again."
        : "Gemini is busy right now. Try again in a moment.",
      status: lastStatus,
    };
  }
  return { error: lastError, status: lastStatus };
}
