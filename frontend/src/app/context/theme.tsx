import {
  createSignal,
  createContext,
  useContext,
  ParentComponent,
  onMount,
} from "solid-js";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: () => Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>();

export const ThemeProvider: ParentComponent = (props) => {
  const [theme, setThemeSignal] = createSignal<Theme>("light");

  // Initialize theme from localStorage or system preference
  onMount(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      setThemeSignal(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const systemTheme = prefersDark ? "dark" : "light";
      setThemeSignal(systemTheme);
      document.documentElement.setAttribute("data-theme", systemTheme);
    }
  });

  const setTheme = (newTheme: Theme) => {
    setThemeSignal(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
