import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type FieldData = { name?: string; values?: string[] };
type GraphLead = { id?: string; created_time?: string; field_data?: FieldData[] };
type GraphError = { error?: { message?: string } };

function field(lead: GraphLead, names: string[]) {
  const match = lead.field_data?.find((item) =>
    names.includes((item.name || "").toLowerCase()),
  );
  return match?.values?.[0] || "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    adAccountId?: unknown;
    accessToken?: unknown;
  } | null;
  const token = typeof body?.accessToken === "string" ? body.accessToken.trim() : "";
  const account = typeof body?.adAccountId === "string" ? body.adAccountId.trim() : "";
  if (!token || !account) {
    return NextResponse.json(
      { error: "Add a Meta ad account ID and access token, or add the lead yourself." },
      { status: 400 },
    );
  }

  const act = account.replace(/^act_/i, "");
  const formsUrl = new URL(`https://graph.facebook.com/v21.0/act_${act}/leadgen_forms`);
  formsUrl.searchParams.set("fields", "id,name");
  formsUrl.searchParams.set("limit", "8");
  formsUrl.searchParams.set("access_token", token);

  const formsResponse = await fetch(formsUrl, { cache: "no-store" }).catch(() => null);
  if (!formsResponse) {
    return NextResponse.json({ error: "Could not reach Meta." }, { status: 502 });
  }
  const formsPayload = (await formsResponse.json().catch(() => null)) as
    | (GraphError & { data?: { id: string; name: string }[] })
    | null;
  if (!formsResponse.ok) {
    const message = (formsPayload?.error?.message || "Meta rejected the connection.").replaceAll(
      token,
      "[redacted]",
    );
    return NextResponse.json({ error: message }, { status: formsResponse.status });
  }

  const forms = formsPayload?.data ?? [];
  const leads: {
    externalId: string;
    name: string;
    company: string;
    source: string;
    created: string;
  }[] = [];

  for (const form of forms.slice(0, 5)) {
    const leadsUrl = new URL(`https://graph.facebook.com/v21.0/${form.id}/leads`);
    leadsUrl.searchParams.set("fields", "created_time,field_data");
    leadsUrl.searchParams.set("limit", "25");
    leadsUrl.searchParams.set("access_token", token);
    const leadsResponse = await fetch(leadsUrl, { cache: "no-store" }).catch(() => null);
    if (!leadsResponse?.ok) continue;
    const leadsPayload = (await leadsResponse.json().catch(() => null)) as { data?: GraphLead[] } | null;
    for (const lead of leadsPayload?.data ?? []) {
      if (!lead.id) continue;
      const name = field(lead, ["full_name", "name"]) || "Meta lead";
      const company = field(lead, ["company_name", "company"]) || form.name || "Meta Ads";
      leads.push({
        externalId: lead.id,
        name,
        company,
        source: "Meta Ads",
        created: lead.created_time || "",
      });
    }
  }

  return NextResponse.json({ leads, forms: forms.length });
}
