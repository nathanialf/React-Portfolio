import { summarizeProgress } from '../src/lib/ico-progress'

describe('summarizeProgress', () => {
  // Trimmed from the live payload at nathanialf.github.io/ico/pal/progress.json
  const valid = {
    version: 'pal',
    totals: {
      matched_funcs: 4053,
      total_funcs: 5741,
      matched_bytes: 623856,
      total_bytes: 1612740,
      sections: { '.text': [623856, 1612740] },
    },
    programmers: [{ name: 'common', tus: [] }],
  }

  it('reduces the payload to the badge numbers', () => {
    expect(summarizeProgress(valid)).toEqual({
      matchedFuncs: 4053,
      totalFuncs: 5741,
      funcPct: 70.6,
      matchedBytes: 623856,
      totalBytes: 1612740,
      bytePct: 38.7,
      version: 'pal',
    })
  })

  it('rounds percentages to one decimal, like the upstream dashboard', () => {
    const summary = summarizeProgress({
      totals: { matched_funcs: 1, total_funcs: 3, matched_bytes: 2, total_bytes: 3 },
    })
    expect(summary?.funcPct).toBe(33.3)
    expect(summary?.bytePct).toBe(66.7)
  })

  it('returns null version when absent or not a string', () => {
    expect(summarizeProgress({ totals: valid.totals })?.version).toBeNull()
    expect(summarizeProgress({ version: 7, totals: valid.totals })?.version).toBeNull()
  })

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['a string', 'nope'],
    ['an object with no totals', { version: 'pal' }],
    ['totals that is not an object', { totals: 'nope' }],
    ['a missing field', { totals: { matched_funcs: 1, total_funcs: 2, matched_bytes: 3 } }],
    ['a string where a number belongs', {
      totals: { matched_funcs: '1', total_funcs: 2, matched_bytes: 3, total_bytes: 4 },
    }],
    ['NaN', {
      totals: { matched_funcs: NaN, total_funcs: 2, matched_bytes: 3, total_bytes: 4 },
    }],
    ['a zero function denominator', {
      totals: { matched_funcs: 0, total_funcs: 0, matched_bytes: 3, total_bytes: 4 },
    }],
    ['a zero byte denominator', {
      totals: { matched_funcs: 1, total_funcs: 2, matched_bytes: 0, total_bytes: 0 },
    }],
  ])('returns null for %s rather than rendering NaN', (_label, input) => {
    expect(summarizeProgress(input)).toBeNull()
  })
})
