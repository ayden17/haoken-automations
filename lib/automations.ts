export type AutomationTemplate = {
  id: string;
  name: string;
  channel: string;
  description: string;
  instructions: string;
};

export const automationTemplates: AutomationTemplate[] = [
  {
    id: "lead-qualify",
    name: "Kualifikasi prospek",
    channel: "Email",
    description: "A short note that confirms fit, budget, and timeline before a call.",
    instructions:
      "Write a qualification email of under 140 words. Ask three specific questions about budget, timeline, and decision maker. Do not use hype.",
  },
  {
    id: "proposal-followup",
    name: "Follow-up proposal",
    channel: "Email sequence",
    description: "Three touches after a proposal goes quiet.",
    instructions:
      "Write a 3-email follow-up sequence. Email 1 is a same-week nudge, email 2 adds one proof point, email 3 offers a smaller starting scope. Label each email.",
  },
  {
    id: "client-onboarding",
    name: "Onboarding klien",
    channel: "Email + checklist",
    description: "Welcome note and the first-week checklist for a new retainer.",
    instructions:
      "Write a welcome email and a 7-item onboarding checklist covering access, brand assets, offer, audience, approval owner, reporting day, and first campaign.",
  },
  {
    id: "weekly-report",
    name: "Laporan mingguan",
    channel: "Client report",
    description: "A narrative the account lead can paste into the Monday update.",
    instructions:
      "Write a weekly performance note with three sections: what moved, what we are changing, and what we need from the client. Keep it under 220 words.",
  },
  {
    id: "social-captions",
    name: "Paket caption sosial",
    channel: "Social",
    description: "Five captions with a hook, body, and suggested CTA.",
    instructions:
      "Write 5 social captions. Each one needs a hook line, two short sentences, and a CTA. Vary the angle: proof, behind the scenes, offer, objection, and reminder.",
  },
  {
    id: "invoice-reminder",
    name: "Pengingat invoice",
    channel: "Email",
    description: "A polite reminder that states the invoice, amount, and next step.",
    instructions:
      "Write a polite invoice reminder. State the invoice is outstanding, ask for payment this week, and offer to resend the PDF. No guilt language.",
  },
  {
    id: "ad-brief",
    name: "Brief iklan",
    channel: "Creative brief",
    description: "A one-page brief for a designer or media buyer.",
    instructions:
      "Write a creative brief with audience, offer, promise, proof, mandatories, and three headline options. Keep each field to one or two sentences.",
  },
  {
    id: "seo-outline",
    name: "Outline konten SEO",
    channel: "Content",
    description: "A search-led article outline the writer can draft from.",
    instructions:
      "Write an SEO article outline: working title, search intent, 6 H2s, and a short note on what each section must answer. No full article.",
  },
  {
    id: "meeting-recap",
    name: "Rekap rapat",
    channel: "Client update",
    description: "Turns call notes into decisions, owners, and dates.",
    instructions:
      "Turn the notes into a recap with decisions, owners, and due dates. If a date is missing, write 'date needed' instead of inventing one.",
  },
  {
    id: "reengagement",
    name: "Kampanye re-engagement",
    channel: "Email",
    description: "A win-back note for a lead who went quiet.",
    instructions:
      "Write a re-engagement email that references the last conversation, offers one useful observation, and asks a single yes/no question. Under 120 words.",
  },
];

export const tones = ["Professional", "Warm", "Direct"] as const;
export type Tone = (typeof tones)[number];

export function templateById(id: string) {
  return automationTemplates.find((template) => template.id === id);
}
