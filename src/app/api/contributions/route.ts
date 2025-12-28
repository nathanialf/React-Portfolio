import { NextRequest, NextResponse } from 'next/server';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubContributionDay {
  contributionCount: number;
  date: string;
  contributionLevel: string;
}

interface GitHubContributionWeek {
  contributionDays: GitHubContributionDay[];
}

interface GitHubResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks?: GitHubContributionWeek[];
        };
      };
    };
  };
}

const LEVEL_MAP: Record<string, number> = {
  'NONE': 0,
  'FIRST_QUARTILE': 1,
  'SECOND_QUARTILE': 2,
  'THIRD_QUARTILE': 3,
  'FOURTH_QUARTILE': 4,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'defnf';

  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    // Return empty data if no token configured
    return NextResponse.json({ contributions: [] });
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                date
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json({ contributions: [] });
    }

    const data: GitHubResponse = await response.json();
    const weeks = data.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];

    const contributions: ContributionDay[] = weeks.flatMap(week =>
      week.contributionDays.map(day => ({
        date: day.date,
        count: day.contributionCount,
        level: LEVEL_MAP[day.contributionLevel] ?? 0,
      }))
    );

    return NextResponse.json({ contributions });
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json({ contributions: [] });
  }
}
