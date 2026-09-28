import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { crawlGoogleMaps } from "@/lib/lead-crawler";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM business_leads ORDER BY created_at DESC LIMIT 200",
    );
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json(
      { error: "Database connection failed." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    query?: unknown;
    location?: unknown;
  } | null;
  const query =
    typeof body?.query === "string" ? body.query.trim().slice(0, 120) : "";
  const location =
    typeof body?.location === "string"
      ? body.location.trim().slice(0, 120)
      : "";

  if (!query || !location) {
    return NextResponse.json(
      { error: "Add a search query and a location." },
      { status: 400 },
    );
  }

  let businesses;
  try {
    businesses = await crawlGoogleMaps(query, location);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The crawler failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  if (!businesses.length) {
    return NextResponse.json(
      { error: "No businesses found. Try a different search." },
      { status: 404 },
    );
  }

  // Persist to PostgreSQL (skip duplicates)
  try {
    for (const biz of businesses) {
      await pool.query(
        `INSERT INTO business_leads
           (name, category, rating, review_count, address, phone, website, search_query, search_location)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (name, address) DO NOTHING`,
        [
          biz.name,
          biz.category ?? null,
          biz.rating ?? null,
          biz.reviewCount ?? null,
          biz.address ?? null,
          biz.phone ?? null,
          biz.website ?? null,
          query,
          location,
        ],
      );
    }
  } catch {
    // Return results even if the database write fails
  }

  return NextResponse.json({ crawled: businesses.length, leads: businesses });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  try {
    await pool.query("DELETE FROM business_leads WHERE id = $1", [id]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not delete the lead." },
      { status: 500 },
    );
  }
}
