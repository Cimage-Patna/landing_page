import Image from "next/image";
import { copy } from "@/lib/copy";

/* Exact replica of MU's .bestOpportunity — white band, "Real students.
   Real offers." heading + "View Placements" pill, and a grid of alumni
   cards (photo, name + LinkedIn, separator, role + bold company, a secondary
   placement tag). Driven by CIMAGE's real star placements. */

const LINKEDIN = copy.footer.socials.find((s) => s.name === "LinkedIn")?.url ?? "#";

type Student = {
  img: string;
  name: string;
  company: string;
  course?: string;
  role?: string;
  package?: string;
  district?: string;
  location?: string;
};

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export default function MUStarPlacements() {
  const s = copy.starPlacements;

  return (
    <section id="placements" className="border-b border-[#e5e5e5] bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="max-w-3xl">
          <h2 className="text-[2.1rem] font-semibold leading-[1.1] text-[#090909] sm:text-[3rem]">
            Real students.{" "}
            <span className="mu-serif italic font-normal">Real offers.</span>
          </h2>
          <p className="mt-4 text-[16px] text-[#525252]">{s.sub}</p>
        </div>

        <div className="mu-oppr-grid">
          {s.students.map((raw, i) => {
            const st = raw as Student;
            const lead = st.role && st.role !== st.location ? st.role : st.course;
            const tag = st.package
              ? { label: "Package · ", value: st.package }
              : st.location
                ? { label: "Based in ", value: st.location }
                : st.district
                  ? { label: "From ", value: st.district }
                  : st.course
                    ? { label: "Programme · ", value: st.course }
                    : null;
            return (
              <article key={i}>
                <div className="mu-oppr-img-wrap">
                  <Image src={st.img} alt={st.name} fill sizes="(max-width:560px) 50vw, 232px" />
                </div>
                <div className="mu-oppr-name">
                  <span>{st.name}</span>
                  <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label={`${st.name} on LinkedIn`}>
                    <LinkedInIcon />
                  </a>
                </div>
                <hr className="mu-oppr-line" />
                <div className="mu-oppr-role">
                  {lead ? `${lead}, ` : ""}
                  <strong>{st.company}</strong>
                </div>
                {tag && (
                  <div className="mu-oppr-tag">
                    {tag.label}
                    <strong>{tag.value}</strong>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
