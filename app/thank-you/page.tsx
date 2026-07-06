"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* Dedicated thank-you page. The lead form stores the submitted details in
   sessionStorage and redirects here. On mount we (1) display those details as
   confirmation and (2) push the GTM `lead_generated` event, then clear the
   stored data so a reload doesn't re-fire the event. */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

type Lead = {
  name?: string;
  email?: string;
  phone?: string;
  course?: string;
  district?: string;
  twelfth_marks?: string;
  board?: string;
  stream?: string;
  formLocation?: string;
};

// +91 + last 10 digits, no spaces (per GTM spec).
function formatPhone(phone?: string): string {
  const digits = (phone || "").replace(/\D/g, "").slice(-10);
  return digits ? `+91${digits}` : "";
}

export default function ThankYouPage() {
  const [lead, setLead] = useState<Lead | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let data: Lead | null = null;
    try {
      const raw = sessionStorage.getItem("cimage_lead");
      if (raw) data = JSON.parse(raw) as Lead;
    } catch {
      /* ignore */
    }

    if (data) {
      setLead(data);

      // ── GTM dataLayer push ────────────────────────────────────────────────
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "lead_generated",
        formLocation: data.formLocation || window.location.hostname,
        user_data: {
          full_name: data.name || "",
          email: data.email || "",
          phone: formatPhone(data.phone),
        },
        course_name: data.course || "",
        district: data.district || "",
        "12th Marks": data.twelfth_marks || "",
        Board: data.board || "",
        Stream: data.stream || "",
      });

      // Fire once — clear so a refresh doesn't re-push the conversion.
      try {
        sessionStorage.removeItem("cimage_lead");
      } catch {
        /* ignore */
      }
    }
    setReady(true);
  }, []);

  const rows: { label: string; value?: string }[] = lead
    ? [
        { label: "Full name", value: lead.name },
        { label: "Mobile", value: formatPhone(lead.phone) },
        { label: "Email", value: lead.email },
        { label: "Course", value: lead.course },
        { label: "District", value: lead.district },
        { label: "12th marks", value: lead.twelfth_marks },
        { label: "Board", value: lead.board },
        { label: "Stream", value: lead.stream },
      ].filter((r) => r.value)
    : [];

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-[#f4f4f5] px-5 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-[#e4e4e7] bg-white p-7 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] sm:p-9">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#12b76a]/12">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" stroke="#12b76a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="mt-5 text-center text-[26px] font-bold leading-tight text-[#090909] sm:text-[30px]">
          {lead?.name ? `Thank you, ${lead.name.split(" ")[0]}!` : "Thank you!"}
        </h1>
        <p className="mt-2 text-center text-[15px] leading-relaxed text-[#525252]">
          Your details have been received. Our admissions team will call you within one working day.
        </p>

        {ready && rows.length > 0 && (
          <div className="mt-7 overflow-hidden rounded-2xl border border-[#ececec]">
            <p className="border-b border-[#ececec] bg-[#fafafa] px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-[#737373]">
              Your submission
            </p>
            <dl className="divide-y divide-[#f0f0f0]">
              {rows.map((r) => (
                <div key={r.label} className="flex items-start justify-between gap-4 px-5 py-3">
                  <dt className="text-[13.5px] text-[#737373]">{r.label}</dt>
                  <dd className="max-w-[62%] text-right text-[14px] font-medium text-[#090909]">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {ready && rows.length === 0 && (
          <p className="mt-6 text-center text-[14px] text-[#737373]">
            If you haven&apos;t applied yet, head back and fill the form — our team is ready to help.
          </p>
        )}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#090909] px-6 text-[14px] font-semibold text-white transition hover:brightness-110"
          >
            Back to Home
          </Link>
          <a
            href="tel:7250767676"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e0e0e0] px-6 text-[14px] font-semibold text-[#090909] transition hover:bg-[#f5f5f5]"
          >
            Call Admissions · 7250 767 676
          </a>
        </div>
      </div>
    </main>
  );
}
