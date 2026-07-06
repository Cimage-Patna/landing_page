import "./globals.css";
import "./mu.css";
import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Inter, Fraunces, Poppins } from "next/font/google";
import Script from "next/script";

// Google Ads global site tag (gtag.js). Loaded once here so it runs on every
// page (home + the Meta landing page, which share this root layout).
const GOOGLE_ADS_ID = "AW-10885034048";

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

// Fraunces = the editorial serif used for headings; Poppins = geometric-sans
// fallback for Galano Grotesque (loaded from a CDN in mu.css). Both feed CSS
// variables consumed by the .mu-root scoped styles in mu.css.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--mu-fraunces",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--mu-poppins",
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

// Theme switcher removed — the site is locked to the light theme. Force it on
// every load so returning visitors with a stale 'theme=dark' aren't stranded.
const noFlashThemeScript = `(function(){try{document.documentElement.setAttribute('data-theme','light');}catch(e){}})();`;

// Google Tag Manager — loaded on every page via this root layout.
const GTM_ID = "GTM-WCHC69L6";
const gtmScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* Google Tag Manager — as high in <head> as possible */}
        <script dangerouslySetInnerHTML={{ __html: gtmScript }} />

        <script dangerouslySetInnerHTML={{ __html: noFlashThemeScript }} />

        {/* Google tag (gtag.js) — Google Ads */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');`}
        </Script>
      </head>
      <body>
        {/* Google Tag Manager (noscript) — immediately after <body> */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>

        <div className={`mu-root ${fraunces.variable} ${poppins.variable}`}>{children}</div>
      </body>
    </html>
  );
}
