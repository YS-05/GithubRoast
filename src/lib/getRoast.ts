// Replaces Figma's mock version. The UI calls getRoast(username) exactly
// as before; now it hits the real backend at /api/roast.

export type RoastResult = {
  user: {
    login: string;
    name: string | null;
    avatarUrl: string;
    bio: string | null;
    followers: number;
    publicRepos: number;
  };
  stats: {
    totalStars: number;
    topLanguages: string[];
  };
  roastScore: number; // 1-10
  roast: string; // paragraphs separated by \n\n
  burns: string[]; // 3 one-liners
  tips?: string[]; // 2-3 practical ways to improve the profile
  isOwner?: boolean; // easter egg: true when the owner's profile gets praised instead
};

// Carries the HTTP status so the UI can tell "user not found" apart from other failures
export class RoastError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function getRoast(username: string): Promise<RoastResult> {
  let res: Response;
  try {
    res = await fetch(`/api/roast?username=${encodeURIComponent(username.trim())}`);
  } catch {
    throw new RoastError("Couldn't reach the server. Is it running?", 0);
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new RoastError(data?.error || "Something went wrong. Try again.", res.status);
  }
  return data as RoastResult;
}
