import "./mu.css";
import type { Metadata } from "next";
import { Fraunces, Poppins } from "next/font/google";

// Fraunces = the exact serif Masters' Union uses for editorial headlines.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--mu-fraunces",
  display: "swap",
});

// Poppins = geometric-sans fallback for Galano Grotesque (loaded from MU's
// CDN in mu.css) so the page still reads right if the CDN font is blocked.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--mu-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CIMAGE Patna — Learn by Doing | Best IT & Management College in Bihar",
  description:
    "Bihar's #1 college for IT & Management. 13,500+ alumni placed, 317 TCS selections in a single drive, ₹37 LPA highest package, IIT Bombay E-Yantra Lab and Wipro Centre of Excellence. Batch 2026 admissions open.",
};

export default function MLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`mu-root ${fraunces.variable} ${poppins.variable}`}>{children}</div>
  );
}
