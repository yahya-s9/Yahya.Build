"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  const flip = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed top-4 right-4 z-[90] w-10 h-10 rounded-full flex items-center justify-center border border-secondary/40 bg-surface/80 text-secondary backdrop-blur hover:bg-secondary/10 transition-colors"
    >
      <span className="material-symbols-outlined text-xl" aria-hidden>{theme === "dark" ? "light_mode" : "dark_mode"}</span>
    </button>
  );
}
