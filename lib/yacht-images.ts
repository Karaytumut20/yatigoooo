const FALLBACK_YACHT_IMAGE = "/yacht_aerial_hero.png";

export function isValidYachtImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getYachtImage(images?: string[]): string {
  return images?.find(isValidYachtImageUrl) || FALLBACK_YACHT_IMAGE;
}
