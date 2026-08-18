export const PROOFPATH_INTRO_SESSION_KEY = "proofpath-intro-seen";

export function shouldShowProofPathIntro(storedValue: string | null): boolean {
  return storedValue !== "1";
}
