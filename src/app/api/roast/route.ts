// GET /api/roast?username=octocat
// Fetches a user's public GitHub data, asks Gemini to roast it,
// and returns a RoastResult (same shape as src/lib/getRoast.ts).

import type { RoastResult } from "@/lib/getRoast";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
};

type GitHubRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  pushed_at: string;
};

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "github-roaster",
  };
  // Optional: raises GitHub's limit from 60 to 5,000 requests/hour
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function GET(req: Request) {
  const username = new URL(req.url).searchParams.get("username")?.trim();

  // GitHub usernames: letters, numbers, hyphens, max 39 chars
  if (!username || !/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    return errorResponse("That's not even a valid GitHub username.", 400);
  }
  if (!process.env.GEMINI_API_KEY) {
    return errorResponse("Server is missing GEMINI_API_KEY.", 500);
  }

  // 1. GitHub data
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers: githubHeaders() }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, {
      headers: githubHeaders(),
    }),
  ]);

  if (userRes.status === 404) {
    return errorResponse("This user doesn't exist. Even GitHub couldn't find them.", 404);
  }
  if (userRes.status === 403 || userRes.status === 429) {
    return errorResponse("GitHub rate limit hit. Try again in a bit.", 429);
  }
  if (!userRes.ok || !reposRes.ok) {
    return errorResponse("Couldn't reach GitHub.", 502);
  }

  const user: GitHubUser = await userRes.json();
  const repos: GitHubRepo[] = await reposRes.json();

  // 2. Stats for the UI + ammo for the roast
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

  const languageCounts: Record<string, number> = {};
  for (const r of repos) {
    if (r.language) languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
  }
  const topLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([lang]) => lang);

  const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
  const accountAgeYears = (
    (Date.now() - new Date(user.created_at).getTime()) /
    (365 * 24 * 60 * 60 * 1000)
  ).toFixed(1);

  const profileSummary = {
    username: user.login,
    name: user.name,
    bio: user.bio,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    accountAgeYears,
    totalStars,
    topLanguages,
    forkedReposCount: repos.filter((r) => r.fork).length,
    reposNotTouchedInOverAYear: repos.filter((r) => new Date(r.pushed_at).getTime() < oneYearAgo)
      .length,
    reposWithNoDescription: repos.filter((r) => !r.description).length,
    reposWithZeroStars: repos.filter((r) => r.stargazers_count === 0).length,
    // Send a sample, not everything, to keep the prompt small
    repos: repos.slice(0, 30).map((r) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      isFork: r.fork,
      lastPushed: r.pushed_at.slice(0, 10),
    })),
  };

  // 3. Ask Gemini for the roast, as JSON
  const systemPrompt = `You are a savage but playful comedian who roasts developers based on their public GitHub profile.
Rules:
- Be specific: reference actual repo names, numbers, languages, dates and habits from the data. Specific details are what make it funny.
- Roast the code, the commit habits, the repo names and the profile, never the person's appearance, identity, race, gender, religion or anything outside their GitHub.
- No slurs, no sexual content, nothing genuinely cruel. Think comedy roast, not bullying.
- If the profile is nearly empty, roast the emptiness.
- "roast": 2-3 short paragraphs separated by a blank line (\\n\\n), under 180 words total.
- "burns": exactly 3 punchy one-liners, each under 20 words.
- "roastScore": an integer 1-10 for how roastable the profile is (10 = a comedy goldmine).`;

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [
          {
            role: "user",
            parts: [{ text: `Roast this GitHub profile:\n${JSON.stringify(profileSummary)}` }],
          },
        ],
        generationConfig: {
          temperature: 1,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              roastScore: { type: "INTEGER" },
              roast: { type: "STRING" },
              burns: { type: "ARRAY", items: { type: "STRING" } },
            },
            required: ["roastScore", "roast", "burns"],
          },
        },
      }),
    }
  );

  if (geminiRes.status === 429) {
    return errorResponse("The roast machine is overheating (rate limit). Try again in a minute.", 429);
  }
  if (!geminiRes.ok) {
    console.error("Gemini error:", geminiRes.status, await geminiRes.text());
    return errorResponse("The roast machine broke. Try again.", 502);
  }

  let roastData: { roastScore: number; roast: string; burns: string[] };
  try {
    const geminiJson = await geminiRes.json();
    const text: string = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    roastData = JSON.parse(text);
  } catch (err) {
    console.error("Couldn't parse Gemini response:", err);
    return errorResponse("The roast came out garbled. Try again.", 502);
  }

  // 4. Return the exact shape the UI expects
  const result: RoastResult = {
    user: {
      login: user.login,
      name: user.name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      followers: user.followers,
      publicRepos: user.public_repos,
    },
    stats: { totalStars, topLanguages },
    roastScore: Math.min(10, Math.max(1, Math.round(roastData.roastScore || 5))),
    roast: roastData.roast,
    burns: (roastData.burns || []).slice(0, 3),
  };

  return Response.json(result);
}
