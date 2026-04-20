import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://creditspot.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CreditsSpot — $1M+ in Startup Credits, Searchable & Refreshed Weekly",
    template: "%s · CreditsSpot",
  },
  description:
    "The only directory of startup credits that refreshes itself. Over $1,000,000 across AWS Activate ($100K), Google Cloud ($350K for AI), Azure ($150K), Stripe Atlas, Razorpay Rize, HubSpot, Notion, and 15+ more. Firecrawl-verified amounts. Weekly changelog.",
  keywords: [
    "startup credits",
    "AWS Activate credits",
    "Google Cloud for Startups",
    "Microsoft for Startups",
    "Azure credits",
    "Stripe Atlas",
    "Razorpay Rize",
    "HubSpot for Startups",
    "Notion for Startups",
    "startup perks India",
    "DPIIT startup benefits",
    "SISFS seed fund",
    "startup program directory",
    "AI startup credits",
    "cloud credits founders",
  ],
  authors: [{ name: "CreditsSpot" }],
  creator: "CreditsSpot",
  publisher: "CreditsSpot",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CreditsSpot — $1M+ in Startup Credits, Refreshed Weekly",
    description:
      "Every major startup credit program in one searchable directory. Firecrawl refreshes the amounts nightly. AWS, GCP, Azure, Stripe, Razorpay, HubSpot, Notion + 15 more.",
    url: SITE_URL,
    siteName: "CreditsSpot",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "CreditsSpot — $1M+ in startup credits, refreshed weekly",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CreditsSpot — $1M+ in Startup Credits, Refreshed Weekly",
    description:
      "Every major startup credit program in one searchable directory. Amounts auto-refreshed nightly. AWS, GCP, Azure, Stripe, Razorpay + 15 more.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CreditsSpot",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    description:
      "Searchable, live-refreshed directory of every major startup credit and perk program.",
  };
  const siteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CreditsSpot",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }}
        />
      </head>
      <body className="bg-bg text-fg antialiased">{children}</body>
    </html>
  );
}
