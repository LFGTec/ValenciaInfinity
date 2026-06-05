// src/utils/formatters.ts

export function formatNumber(value: number | null | undefined) {
  return (value ?? 0).toLocaleString("en-US");
}