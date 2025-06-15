import { browser } from "$app/environment";
import { writable } from "svelte/store";

type Theme = "light" | "dark";

// Get initial theme from localStorage or system preference
function getInitialTheme(): Theme {
  if (browser) {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme === "dark" || savedTheme === "light") return savedTheme;

    // Check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

// Create the store
const theme = writable<Theme>(getInitialTheme());

// Subscribe to changes and update localStorage and document
if (browser) {
  theme.subscribe((value) => {
    localStorage.setItem("theme", value);
    document.documentElement.classList.toggle("dark", value === "dark");
  });
}

export { theme };
