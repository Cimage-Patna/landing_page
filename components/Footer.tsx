import { ADMISSION_PHONES } from "@/lib/contact";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-6xl px-6 py-5 text-center text-xs text-neutral-500">
        {/* Admission support numbers */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            Admissions
          </span>
          {ADMISSION_PHONES.map((p) => (
            <a
              key={p.dial}
              href={`tel:${p.dial}`}
              className="inline-flex items-center gap-1.5 text-neutral-300 transition hover:text-amber-400"
            >
              <PhoneIcon />
              {p.display}
            </a>
          ))}
        </div>

        {/* Credit line */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 border-t border-white/5 pt-3">
          <span>© {new Date().getFullYear()} CIMAGE</span>
          <span className="text-neutral-700">·</span>
          <span className="inline-flex items-center gap-1.5">
            Designed with
            <Heart />
            by
            <a
              href="https://cimage.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-300 transition hover:text-amber-400"
            >
              cimage.ai
            </a>
            in India
          </span>
        </div>
      </div>
    </footer>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 shrink-0 text-amber-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function Heart() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="inline-block h-3.5 w-3.5 text-amber-500"
    >
      <path d="M12 21s-6.716-4.297-9.428-7.01C.86 12.278.86 9.293 2.572 7.58a4.05 4.05 0 0 1 5.727 0L12 11.28l3.701-3.7a4.05 4.05 0 0 1 5.727 0c1.712 1.713 1.712 4.698 0 6.41C18.716 16.703 12 21 12 21z" />
    </svg>
  );
}
