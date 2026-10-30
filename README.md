# GitHub Roaster

Enter a GitHub username and get a brutally specific, AI-generated roast of the profile: the abandoned repos, the missing descriptions, the zero stars, all of it.

## Features

- **Real profile data**: pulls public profile and repo info straight from the GitHub API
- **Specific roasts**: the AI reads actual repo names, languages, star counts and commit dates, so the jokes are about *your* profile, not generic dev humor
- **Roast score**: a 1–10 rating of how roastable the profile is, plus three top burns
- **Copy to clipboard**: share the damage
- **Model fallback**: if the main Gemini model is overloaded, it automatically falls back to the next one

## Tech stack

- [Next.js](https://nextjs.org) (App Router) with React and TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Gemini API](https://ai.google.dev) for the roasts
- [GitHub REST API](https://docs.github.com/en/rest) for profile data
- UI first designed with Figma Make

## How it works

1. The frontend sends the username to `/api/roast`.
2. The API route fetches the user's profile and repos from GitHub and summarizes them (stale repos, repos without descriptions, top languages, total stars).
3. That summary goes to Gemini with a roast prompt, and Gemini replies with structured JSON: the roast, three burns and a score.
4. The frontend renders the result card.

The API key stays on the server and is never sent to the browser.

## Running it locally

**1. Clone and install**

```bash
git clone https://github.com/YS-05/GithubRoast.git
cd GithubRoast
npm install
```

**2. Add your API key**

Get a free key from [Google AI Studio](https://aistudio.google.com), then:

```bash
cp .env.example .env.local
```

Open `.env.local` and paste your key after `GEMINI_API_KEY=`.

**3. Run it**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and roast someone.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Your Gemini API key from Google AI Studio |
| `GEMINI_MODELS` | No | Comma-separated models to try in order. Defaults to `gemini-3.6-flash,gemini-3.5-flash,gemini-3.5-flash-lite` |
| `GITHUB_TOKEN` | No | A GitHub personal access token (no scopes needed). Raises GitHub's rate limit from 60 to 5,000 requests per hour |

## Disclaimer

All roasts are AI-generated and meant in good fun. Only public GitHub data is used.
