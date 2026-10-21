import { NextResponse } from 'next/server';
import { ICO_TARGETS, TargetProgress, summarizeProgress } from '../../../lib/ico-progress';

// The dashboard publishes six targets, each from its own decomp branch:
// pal -> pal (PAL retail, SCES-50760), ntsc -> us, jpn -> jpn, kor -> kor,
// aug6 -> the Aug-6-2001 prototype, jun26 -> the Jun-26-2001 demo. Each lives
// at <base>/<id>/progress.json.
// The site root's /progress.json is a compat copy that always holds the *aug6*
// data for stale browser caches -- do not point at it.
//
// Note the data lives at a path (/ico/pal/progress.json) while the human-facing
// dashboard is hash-routed off the root (/ico/#pal); they are not the same shape.
//
// The URL is a constant, not a query param: taking it from the caller would
// turn this route into an open proxy.
const PROGRESS_BASE_URL = 'https://nathanialf.github.io/ico';

async function fetchTarget(target: typeof ICO_TARGETS[number]): Promise<TargetProgress | null> {
  try {
    const response = await fetch(`${PROGRESS_BASE_URL}/${target.id}/progress.json`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) return null;

    const summary = summarizeProgress(await response.json());
    if (!summary) {
      console.warn(`ICO progress: unexpected payload shape for ${target.id}`);
      return null;
    }

    return { ...summary, target };
  } catch (error) {
    console.error(`ICO progress fetch error for ${target.id}:`, error);
    return null;
  }
}

export async function GET() {
  // A target that fails drops out on its own rather than taking the rest with it
  const results = await Promise.all(ICO_TARGETS.map(fetchTarget));
  const targets = results.filter((t): t is TargetProgress => t !== null);

  // Nothing came back: don't let the CDN hold an empty list for an hour
  if (targets.length === 0) {
    return NextResponse.json({ targets });
  }

  return NextResponse.json(
    { targets },
    {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}
