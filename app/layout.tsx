import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Inter } from "next/font/google";

const display = Big_Shoulders({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BCA Admission 2026 — CIMAGE, Patna · Bihar's #1 BCA College",
  description:
    "BCA at CIMAGE Patna: 317 in TCS, 102 in ICICI Bank, ₹37 LPA highest package, IIT Bombay E-Yantra Lab, Wipro Centre of Excellence. Batch 2026 admissions open. Fee ₹1.8 lakhs/year.",
  openGraph: {
    title: "BCA. Built for what's next. — CIMAGE Patna",
    description:
      "Bihar's #1 BCA college. Batch 2026 admissions open. Fee ₹1.8 lakhs/year.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

const noFlashThemeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashThemeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
