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
  twelfth_marks?: string;
  board?: string;
  stream?: string;
  district?: string;
  city?: string;
  state?: string;
  comment?: string;
  // "fee" = the lightweight fee-structure download form (name + phone + course
  // only). Anything else falls through to the full admission lead form.
  form_type?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

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

  const isFee = (body.form_type ?? "").trim() === "fee";

  const twelfthMarks = (body.twelfth_marks ?? "").trim();
  const board = (body.board ?? "").trim();
  const stream = (body.stream ?? "").trim();

  // The fee-structure download form only collects name, phone and course — skip
  // the 12th-marks/board/stream gate that the full admission form enforces.
  if (!isFee) {
    if (!twelfthMarks || !board || !stream) {
      return NextResponse.json(
        { ok: false, error: "12th marks, board and stream are required." },
        { status: 422 },
      );
    }

    // 12th marks must be a percentage strictly between 40 and 100.
    const marks = parseFloat(twelfthMarks.replace("%", "").trim());
    if (!(marks > 40 && marks < 100)) {
      return NextResponse.json(
        { ok: false, error: "12th marks must be a percentage between 40 and 100." },
        { status: 422 },
      );
    }
  }

  // Forward only the UTM params that were actually present on the URL.
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = (body[key] ?? "").trim();
    if (value) utm[key] = value;
  }

  const payload = {
    name,
    phone,
    email: (body.email ?? "").trim(),
    course: (body.course ?? "BCA").trim(),
    // Fee leads only collect name/phone/course; these are optional upstream.
    twelfth_marks: twelfthMarks,
    board,
    stream,
    // The form collects "district"; the backend stores it under the city key.
    city: (body.district ?? body.city ?? "").trim(),
    state: (body.state ?? "Bihar").trim(),
    lead_type: "hot",
    sub_source: isFee ? "fee-structure" : SUB_SOURCE,
    comment: (body.comment ?? "").trim(),
    // Fee-structure enquiries carry an extra "fee-structure" tag so the CRM can
    // segment download leads from full admission applications.
    tags: isFee ? [...TAGS, "fee-structure"] : TAGS,
    ...utm,
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
