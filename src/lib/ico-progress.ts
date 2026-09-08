export interface ProgressSummary {
  matchedFuncs: number;
  totalFuncs: number;
  funcPct: number;
  matchedBytes: number;
  totalBytes: number;
  bytePct: number;
  version: string | null;
}

interface ProgressTotals {
  matched_funcs?: unknown;
  total_funcs?: unknown;
  matched_bytes?: unknown;
  total_bytes?: unknown;
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

// One decimal, matching the upstream dashboard's own fmtPct
const pct = (matched: number, total: number) => Math.round((1000 * matched) / total) / 10;

/**
 * Reduce the ICO decomp progress.json (~522KB, almost entirely per-function
 * detail we do not need) to the handful of numbers the badge renders.
 * Returns null on any unexpected shape so the badge disappears rather than
 * rendering NaN if the upstream format version moves on.
 */
export function summarizeProgress(raw: unknown): ProgressSummary | null {
  if (!raw || typeof raw !== 'object') return null;

  const totals = (raw as { totals?: unknown }).totals as ProgressTotals | undefined;
  if (!totals || typeof totals !== 'object') return null;

  const { matched_funcs, total_funcs, matched_bytes, total_bytes } = totals;
  if (!isNum(matched_funcs) || !isNum(total_funcs) || !isNum(matched_bytes) || !isNum(total_bytes)) {
    return null;
  }
  if (total_funcs <= 0 || total_bytes <= 0) return null;

  const version = (raw as { version?: unknown }).version;

  return {
    matchedFuncs: matched_funcs,
    totalFuncs: total_funcs,
    funcPct: pct(matched_funcs, total_funcs),
    matchedBytes: matched_bytes,
    totalBytes: total_bytes,
    bytePct: pct(matched_bytes, total_bytes),
    version: typeof version === 'string' ? version : null,
  };
}
