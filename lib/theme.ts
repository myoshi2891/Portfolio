export const THEME_STORAGE_KEY = "portfolio-theme";
export const THEME_CHANGE_EVENT = "portfolio-theme-change";
export type ColorTheme = "light" | "dark";

// Apply the saved choice before the first paint. Without a choice, CSS follows the OS.
export const themeInitScript = `(() => { try { const theme = localStorage.getItem("${THEME_STORAGE_KEY}"); if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme; } catch {} })();`;

export function getTheme(): ColorTheme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function setTheme(theme: ColorTheme) {
  document.documentElement.dataset.theme = theme;
  try { window.localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { /* Keep the current choice when storage is unavailable. */ }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function subscribeTheme(onChange: () => void) {
  const preference = window.matchMedia("(prefers-color-scheme: dark)");
  const syncStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    if (event.newValue === "light" || event.newValue === "dark") document.documentElement.dataset.theme = event.newValue;
    else delete document.documentElement.dataset.theme;
    onChange();
  };
  preference.addEventListener("change", onChange);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener("storage", syncStorage);
  return () => {
    preference.removeEventListener("change", onChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", syncStorage);
  };
}
