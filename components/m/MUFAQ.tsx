"use client";

import { useState } from "react";
import { copy } from "@/lib/copy";

/* Exact replica of MU's .faqWrapBox — grey band, "Frequently Asked Questions"
   heading (sans + Fraunces italic), left category tabs and a right accordion
   with circular togglers. CIMAGE's FAQs grouped into categories. */

const Q = copy.faq.items;

const TABS = [
  { label: "Admissions & Eligibility", items: [Q[0], Q[5]] },
  { label: "Placements & Internships", items: [Q[1], Q[4], Q[7]] },
  { label: "Courses & Teaching", items: [Q[3], Q[2]] },
  { label: "Campus & Facilities", items: [Q[6]] },
];

export default function MUFAQ() {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(0); // index within the active tab; -1 = none
  const items = TABS[tab].items;

  const selectTab = (i: number) => {
    setTab(i);
    setOpen(0);
  };

  return (
    <section id="faq" className="bg-[#f3f3f3] py-16 sm:py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <h2 className="text-[2.1rem] font-semibold leading-[1.1] text-[#090909] sm:text-[3rem]">
          Frequently Asked <span className="mu-serif italic font-normal">Questions</span>
        </h2>

        <div className="mu-faq-wrap">
          {/* left category tabs */}
          <nav className="mu-faq-nav mu-no-scrollbar">
            {TABS.map((t, i) => (
              <button
                key={t.label}
                type="button"
                onClick={() => selectTab(i)}
                className={`mu-faq-tab ${i === tab ? "is-active" : ""}`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {/* right accordion */}
          <div className="mu-faq-content">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className="mu-faq-item">
                  <button
                    type="button"
                    className="mu-faq-q"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span>{item.q}</span>
                    <span className="mu-faq-toggle" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                  <div className={`mu-faq-a-wrap ${isOpen ? "open" : ""}`}>
                    <div className="mu-faq-a">
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
