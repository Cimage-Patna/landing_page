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
  title: "CIMAGE Patna — Best IT & Management College in Bihar",
  description:
    "Bihar's #1 college for IT & Management. BCA, MCA, BBA, MBA, B.Sc-IT and B.Com.(P) with 13,500+ alumni placed, 317 selections at TCS in a single drive, ₹37 LPA highest package, IIT Bombay E-Yantra Lab and Wipro Centre of Excellence. Batch 2026 admissions open.",
  openGraph: {
    title: "Best IT & Management College in Bihar — CIMAGE Patna",
    description:
      "Bihar's #1 college for IT & Management. 13,500+ alumni placed over 17+ years. Batch 2026 admissions open.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#eef3fc",
  width: "device-width",
  initialScale: 1,
};

const noFlashThemeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t='light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

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
