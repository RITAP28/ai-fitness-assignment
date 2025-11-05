import { create } from "zustand";

// Allowed theme values
type Theme = "light" | "dark" | "system";

interface UIStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  theme:
    (typeof window !== "undefined"
      ? (localStorage.getItem("theme") as Theme) ||
        "system"
      : "system"),

  setTheme: (theme) =>
    set(() => {
      localStorage.setItem("theme", theme);
      applyTheme(theme);
      return { theme };
    }),

  toggleTheme: () => {
    const current = get().theme;
    const next = current === "light" ? "dark" : "light";
    localStorage.setItem("theme", next);
    applyTheme(next);
    set({ theme: next });
  },
}));

// Apply theme to <html> element
function applyTheme(theme: Theme) {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (theme === "dark" || (theme === "system" && systemDark)) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}
