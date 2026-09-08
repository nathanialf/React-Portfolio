import { NextResponse } from 'next/server';
import { summarizeProgress } from '../../../lib/ico-progress';

// The dashboard publishes three targets: main -> pal (PAL retail, SCES-50760),
// ntsc -> us, aug6 -> the Aug-6-2001 prototype. We track main, hence `pal`.
// The site root's /progress.json is a compat copy that always holds the *aug6*
// data for stale browser caches -- do not point at it.
//
// Note the data lives at a path (/ico/pal/progress.json) while the human-facing
// dashboard is hash-routed off the root (/ico/#pal); they are not the same shape.
//
// The URL is a constant, not a query param: taking it from the caller would
// turn this route into an open proxy.
const PROGRESS_URL = process.env.ICO_PROGRESS_URL
  || 'https://nathanialf.github.io/ico/pal/progress.json';

export async function GET() {
  try {
    const response = await fetch(PROGRESS_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json({ progress: null });
    }

    const progress = summarizeProgress(await response.json());

    if (!progress) {
      console.warn('ICO progress: unexpected payload shape');
    }

    return NextResponse.json(
      { progress },
      {
        headers: {
          'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('ICO progress fetch error:', error);
    return NextResponse.json({ progress: null });
  }
}
