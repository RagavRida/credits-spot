import type { MetadataRoute } from "next";

const SITE_URL = "https://creditspot.vercel.app";

// Explicitly allow the crawlers that matter for both classic SEO and
// Generative Engine Optimization (ChatGPT, Perplexity, Claude, Copilot, Gemini).
const AI_BOTS = [
  "Googlebot",
  "Bingbot",
  "DuckDuckBot",
  "Slurp",
  "PerplexityBot",
  "ChatGPT-User",
  "GPTBot",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "CCBot",
  "Applebot",
  "Applebot-Extended",
  "Bytespider",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/preview/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
