const moneyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const scoreFormatter = new Intl.NumberFormat("en-GB", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

export function formatMoney(cents: number) {
  return moneyFormatter.format((Number.isFinite(cents) ? cents : 0) / 100);
}

export function formatShortDateTime(value: Date | string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(typeof value === "string" ? new Date(value) : value);
}

export function formatShortDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(typeof value === "string" ? new Date(value) : value);
}

export function formatMonthYear(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(value);
}

export function formatScore(value: number) {
  return `${scoreFormatter.format(Number.isFinite(value) ? value : 0)} / 5`;
}
