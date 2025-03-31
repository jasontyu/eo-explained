/**
 * Site configuration values
 */

// Hard-coded site URL instead of using environment variables
export function getSiteUrl(): string {
  return "https://executive-orders-explained.vercel.app"
}

// Site metadata
export const siteConfig = {
  name: "Trump Executive Orders - Explained",
  description: "Stay up to date with bite-sized summaries, no legalese",
  defaultLanguage: "en",
}

