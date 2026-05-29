import { NextResponse } from "next/server";

export const runtime = "nodejs";

// CIMAGE admission backend ingest endpoint. We proxy server-side so the browser
// never hits it directly (avoids CORS) and so lead_type / sub_source / tags are
// stamped consistently and can't be tampered with from the client.
const LEAD_ENDPOINT =
  "https://backend-admission.cimagepatna.com/api/leads/ingest/mediagarh-landing/";

const SUB_SOURCE = "general-landing";
const TAGS = ["mediagarh", "ads"];

type LeadInput = {
  name?: string;
  phone?: string;
  email?: string;
  course?: string;
  city?: string;
  state?: string;
  comment?: string;
};

export async function POST(req: Request) {
  let body: LeadInput;
  try {
    body = (await req.json()) as LeadInput;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const digits = phone.replace(/\D/g, "");

  if (!name || digits.length < 10) {
    return NextResponse.json(
      { ok: false, error: "Name and a valid phone number are required." },
      { status: 422 },
    );
  }

  const payload = {
    name,
    phone,
    email: (body.email ?? "").trim(),
    course: (body.course ?? "BCA").trim(),
    city: (body.city ?? "").trim(),
    state: (body.state ?? "Bihar").trim(),
    lead_type: "hot",
    sub_source: SUB_SOURCE,
    comment: (body.comment ?? "").trim(),
    tags: TAGS,
  };

  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[LEAD] upstream rejected", res.status, detail.slice(0, 500));
      return NextResponse.json(
        { ok: false, error: "Could not submit right now." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[LEAD] upstream unreachable", err);
    return NextResponse.json(
      { ok: false, error: "Could not submit right now." },
      { status: 502 },
    );
  }
}
