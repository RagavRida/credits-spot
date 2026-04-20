import type { Program } from "@/lib/programs";
import { displayAmount } from "@/lib/program-utils";

const SITE_URL = "https://creditspot.vercel.app";

export const FAQS: { q: string; a: string }[] = [
  {
    q: "What are startup credits?",
    a: "Startup credits are free usage allowances — typically $5,000 to $350,000 — that cloud providers and SaaS companies give to early-stage startups. AWS Activate, Google for Startups Cloud, and Microsoft for Startups Founders Hub are the three largest programs. Credits cover compute, storage, AI model usage, analytics, CRMs, and developer tooling so founders can validate products without burning pre-seed capital.",
  },
  {
    q: "How much can a pre-seed startup actually stack in credits?",
    a: "A well-prepared pre-seed startup can realistically stack over $500,000 in combined credits across infrastructure, dev tools, and SaaS. The breakdown: $100,000–$350,000 from one primary cloud provider, $50,000 from analytics and database programs (PostHog, MongoDB), $12,000 from Notion, $10,000 from Freshworks for DPIIT-recognized Indian startups, and $50,000+ from Stripe Atlas partner perks. Razorpay Rize alone adds $300,000 to $500,000 worth of bundled partner credits for Indian founders.",
  },
  {
    q: "Which startup credit program is best for AI startups in 2026?",
    a: "Google for Startups Cloud is the most generous program for AI-first startups in 2026, offering up to $350,000 in Google Cloud credits over two years, plus access to Gemini API credits and BigQuery. Microsoft for Startups Founders Hub follows at up to $150,000 with bundled OpenAI credits and GitHub Enterprise. AWS Activate gives up to $100,000 and remains the default for teams already building on AWS.",
  },
  {
    q: "Do Indian startups get special credit programs?",
    a: "Yes. DPIIT-recognized Indian startups get three India-specific programs: Startup India partnered services (Freshworks $10,000, Zoho ₹2,00,000+ in wallet credits), Razorpay Startup Perks (₹30,00,000+ in payment and banking benefits), and Razorpay Rize ($300,000–$500,000 in global partner credits including AWS, Canva, and Notion). The Startup India Seed Fund Scheme additionally provides grants and equity up to ₹50 lakh via registered incubators.",
  },
  {
    q: "How often do startup credit amounts change?",
    a: "Credit program amounts change roughly every quarter. In 2025 alone: Google Cloud expanded AI-first tier from $200,000 to $350,000, MongoDB boosted credits by 50%, and PostHog raised its cap to $50,000. Heroku's startup program was retired entirely. CreditsSpot uses a Firecrawl-powered nightly scan of each program's official page to catch these changes, and subscribers receive a weekly email digest summarizing amounts up, amounts down, new programs, and retired ones.",
  },
  {
    q: "Do I need a VC or accelerator to apply for startup credits?",
    a: "Not for most programs. AWS Activate, Google for Startups Cloud, MongoDB for Startups, PostHog, Notion, and Stripe Atlas can be applied to directly. Some tiers require a partner referral — Microsoft Founders Hub's highest tier ($150,000), HubSpot's deepest discounts, and Stripe's partner program for fee waivers all benefit from accelerator or VC affiliation. Early-stage Indian founders should apply through DPIIT registration and Startup India partner offers to unlock Freshworks, Zoho, and Razorpay tiers without a VC intro.",
  },
];

type Props = { programs: Program[] };

export default function StructuredData({ programs }: Props) {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Startup credit and perk programs",
    description:
      "Directory of every major startup credit program with live-refreshed amounts and eligibility.",
    numberOfItems: programs.length,
    itemListElement: programs.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Offer",
        name: p.name,
        description: p.verifiedNotes || p.description,
        url: p.officialUrl,
        category: p.category,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          description: displayAmount(p),
        },
        eligibleCustomerType: p.eligibility || "Early-stage startup",
      },
    })),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Startup credits directory",
        item: `${SITE_URL}/#directory`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
