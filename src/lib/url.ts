/** Parses an absolute URL, returning null when it is missing or invalid */
export function parseUrl(value: string | undefined): URL | null {
  if (!value) return null;

  try {
    return new URL(value);
  } catch {
    return null;
  }
}
