# GitHub Roaster

Enter a GitHub username and get a roast written by AI, based on the profile's actual repos, languages and activity.

**Live:** https://github-roast-phi.vercel.app

## Features

- **Real profile data**: pulls public profile and repo info straight from the GitHub API
- **Specific roasts**: the AI reads actual repo names, languages, star counts and push dates, so the jokes are about *your* profile, not generic dev humor
- **Reads your READMEs and commit messages**: takes a closer look at your most recently pushed repos, so vague commits and default-template READMEs don't go unnoticed
- **How to fix it**: every roast ends with 2–3 practical, specific tips to improve the profile
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
3. If a GitHub token is configured, it also fetches the profile README plus README excerpts and recent commit messages from the 5 most recently pushed repos.
4. That summary goes to Gemini, which replies with structured JSON: the roast, three burns, a score and improvement tips.
5. The frontend renders the result card.

API keys stay on the server and are never sent to the browser.

## Running it locally

**1. Clone and install**

```bash
git clone https://github.com/YS-05/GithubRoast.git
cd GithubRoast
npm install
```

**2. Add your keys**

Get a free Gemini key from [Google AI Studio](https://aistudio.google.com) and, optionally, a [fine-grained GitHub token](https://github.com/settings/personal-access-tokens/new) with read-only access to public repositories. Then:

```bash
cp .env.example .env.local
```

Open `.env.local` and paste your keys in.

**3. Run it**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and roast someone.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Your Gemini API key from Google AI Studio |
| `GITHUB_TOKEN` | Recommended | A fine-grained GitHub token (public repos, read-only, no extra permissions). Enables the README and commit message analysis, and raises GitHub's rate limit from 60 to 5,000 requests per hour |
| `GEMINI_MODELS` | No | Comma-separated models to try in order. Defaults to `gemini-3.6-flash,gemini-3.5-flash,gemini-3.5-flash-lite` |

## Disclaimer

All roasts are AI-generated and meant in good fun. Only public GitHub data is used.
