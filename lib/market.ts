export type MarketKey = "uk" | "nigeria" | "germany" | "spain" | "mauritius" | "france" | "us" | "canada";

export type MarketProfile = {
  key: MarketKey;
  label: string;
  locale: string;
  currency: string;
  accent: string;
  description: string;
};

export const marketKeys = ["uk", "nigeria", "germany", "spain", "mauritius", "france", "us", "canada"] as const;

export const marketProfiles: Record<MarketKey, MarketProfile> = {
  uk: {
    key: "uk",
    label: "United Kingdom",
    locale: "en-GB",
    currency: "GBP",
    accent: "UK",
    description: "British tutoring, invoicing, and lesson timing.",
  },
  nigeria: {
    key: "nigeria",
    label: "Nigeria",
    locale: "en-NG",
    currency: "NGN",
    accent: "NG",
    description: "Nigerian clients with naira billing and local date formats.",
  },
  germany: {
    key: "germany",
    label: "Germany",
    locale: "de-DE",
    currency: "EUR",
    accent: "DE",
    description: "German lesson flows with euro pricing.",
  },
  spain: {
    key: "spain",
    label: "Spain",
    locale: "es-ES",
    currency: "EUR",
    accent: "ES",
    description: "Spanish-language tutoring with euro billing.",
  },
  mauritius: {
    key: "mauritius",
    label: "Mauritius",
    locale: "en-MU",
    currency: "MUR",
    accent: "MU",
    description: "Mauritius-ready lesson scheduling and rupee billing.",
  },
  france: {
    key: "france",
    label: "France",
    locale: "fr-FR",
    currency: "EUR",
    accent: "FR",
    description: "French tutoring flows with euro billing and local formatting.",
  },
  us: {
    key: "us",
    label: "United States",
    locale: "en-US",
    currency: "USD",
    accent: "US",
    description: "US tutoring with dollar billing and familiar date formats.",
  },
  canada: {
    key: "canada",
    label: "Canada",
    locale: "en-CA",
    currency: "CAD",
    accent: "CA",
    description: "Canadian tutoring with Canadian dollar billing and local date formatting.",
  },
};

const defaultMarket: MarketKey = "uk";

export function normalizeMarket(value?: string | null): MarketKey {
  const normalized = String(value || defaultMarket).trim().toLowerCase();
  if ((marketKeys as readonly string[]).includes(normalized)) {
    return normalized as MarketKey;
  }

  return defaultMarket;
}

export function getMarketProfile(value?: string | null): MarketProfile {
  return marketProfiles[normalizeMarket(value)];
}

export function listMarketProfiles() {
  return Object.values(marketProfiles);
}
