import type { Metadata, Viewport } from "next";
import { Inter, Manjari } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manjari = Manjari({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-manjari",
  display: "swap",
});

const APP_URL = "https://vishu.adarsh.dev"; // update to your real domain

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Vishu Kani – Digital Darshanam & Kaineetam",
    template: "%s | Vishu Kani",
  },
  description:
    "Send personalised Vishu wishes, share a beautiful digital Vishu Kani experience and gift Kaineetam instantly via UPI – all in one place.",
  keywords: [
    "Vishu",
    "Vishu Kani",
    "Vishu wishes",
    "Vishu Kaineetam",
    "Happy Vishu",
    "Vishu greetings",
    "UPI gift",
    "Kerala festival",
    "Onam",
  ],
  authors: [{ name: "Adarsh", url: APP_URL }],
  creator: "Adarsh",
  publisher: "Vishu Kani",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: APP_URL,
    siteName: "Vishu Kani",
    title: "Vishu Kani – Digital Darshanam & Kaineetam",
    description:
      "Send personalised Vishu wishes and gift Kaineetam via UPI – a beautiful digital celebration of Kerala's harvest festival.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vishu Kani – Digital Darshanam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vishu Kani – Digital Darshanam & Kaineetam",
    description:
      "Send personalised Vishu wishes and gift Kaineetam via UPI. A beautiful digital celebration of Kerala's harvest festival.",
    images: ["/og-image.png"],
    creator: "@adarsh",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#D4AF37",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ml-IN" dir="ltr">
      <head>
        {/* Preconnect to Google Fonts CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Structured data – WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Vishu Kani",
              url: APP_URL,
              description:
                "Personalised Vishu Kani digital experience with UPI Kaineetam gifting.",
              inLanguage: "ml-IN",
              publisher: {
                "@type": "Person",
                name: "Adarsh",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${manjari.variable} font-sans antialiased`}
      >
        {children}

        {/* Global footer — appears on every page */}
        <SiteFooter />
      </body>
    </html>
  );
}
