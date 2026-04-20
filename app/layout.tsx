import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CreditsSpot — Every startup credit worth stacking",
  description:
    "Over $1,000,000 in AWS, GCP, Azure, Stripe, Razorpay, HubSpot, Notion and more startup credits. Searchable directory of every program worth applying to.",
  openGraph: {
    title: "CreditsSpot — Every startup credit worth stacking",
    description:
      "Over $1,000,000 in startup credits across cloud, dev tools, productivity, CRM, payments, and India-specific programs.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-bg text-fg antialiased">{children}</body>
    </html>
  );
}
