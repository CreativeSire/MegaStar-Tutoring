import { getMarketProfile } from "@/lib/market";

type FormatMarket = string | null | undefined;

function resolveMarket(value?: FormatMarket) {
  return getMarketProfile(value);
}

export function formatMoney(cents: number, market?: FormatMarket) {
  const profile = resolveMarket(market);
  return new Intl.NumberFormat(profile.locale, {
    style: "currency",
    currency: profile.currency,
    maximumFractionDigits: 0,
  }).format((Number.isFinite(cents) ? cents : 0) / 100);
}

export function formatShortDateTime(value: Date | string, market?: FormatMarket) {
  const profile = resolveMarket(market);
  return new Intl.DateTimeFormat(profile.locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(typeof value === "string" ? new Date(value) : value);
}

export function formatShortDate(value: Date | string, market?: FormatMarket) {
  const profile = resolveMarket(market);
  return new Intl.DateTimeFormat(profile.locale, {
    dateStyle: "medium",
  }).format(typeof value === "string" ? new Date(value) : value);
}

export function formatMonthYear(value: Date, market?: FormatMarket) {
  const profile = resolveMarket(market);
  return new Intl.DateTimeFormat(profile.locale, {
    month: "long",
    year: "numeric",
  }).format(value);
}

export function formatScore(value: number, market?: FormatMarket) {
  const profile = resolveMarket(market);
  return `${new Intl.NumberFormat(profile.locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(Number.isFinite(value) ? value : 0)} / 5`;
}
