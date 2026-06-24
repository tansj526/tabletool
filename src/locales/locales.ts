export const SUPPORTED_LANGUAGES = ["zh", "en", "fr", "es", "pt", "de", "ja"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";
export const LANGUAGE_STORAGE_KEY = "tabletool-language";

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return SUPPORTED_LANGUAGES.some((language) => language === value);
}

export function getLocaleFromPathname(pathname: string): SupportedLanguage | null {
  const segment = pathname.split("/").filter(Boolean)[0] ?? "";
  return isSupportedLanguage(segment) ? segment : null;
}

export function getBrowserLanguage(language: string | null | undefined): SupportedLanguage {
  const normalizedLanguage = language?.toLowerCase().replace("_", "-") ?? "";
  const primaryLanguage = normalizedLanguage.split("-")[0] ?? "";

  if (isSupportedLanguage(normalizedLanguage)) {
    return normalizedLanguage;
  }

  if (isSupportedLanguage(primaryLanguage)) {
    return primaryLanguage;
  }

  return DEFAULT_LANGUAGE;
}

export function getStoredLanguage(): SupportedLanguage | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return storedLanguage && isSupportedLanguage(storedLanguage) ? storedLanguage : null;
}

export function getLocalizedPath(pathname: string, nextLocale: SupportedLanguage) {
  const segments = pathname.split("/").filter(Boolean);
  const hasLocalePrefix = segments.length > 0 && isSupportedLanguage(segments[0]);
  const pathSegments = hasLocalePrefix ? segments.slice(1) : segments;

  if (nextLocale === DEFAULT_LANGUAGE) {
    return pathSegments.length > 0 ? `/${pathSegments.join("/")}` : "/";
  }

  return `/${[nextLocale, ...pathSegments].join("/")}`;
}
