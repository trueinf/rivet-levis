export function fmtWin(s) {
  if (s <= 0) return null;
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export function scoreColor(s) {
  return s >= 85 ? "var(--red-bright)" : s >= 72 ? "var(--stitch)" : "var(--denim)";
}
