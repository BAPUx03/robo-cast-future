import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  // Dark is the default; light only when the visitor picked it before.
  if (typeof window === "undefined") return "dark";
  try {
    return window.localStorage.getItem("mw-theme") === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    try {
      window.localStorage.setItem("mw-theme", next);
    } catch {
      /* ignore storage errors */
    }
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={`group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-card/60 text-foreground backdrop-blur transition hover:border-brand/50 hover:text-brand ${className}`}
    >
      {/* Sun (light mode active visual = sun shown when dark, since clicking will go to light? We show CURRENT theme icon) */}
      <Sun
        className={`absolute h-4 w-4 transition-all duration-300 ${
          mounted && !isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-300 ${
          !mounted || isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
