// context/ThemeContext.jsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../services/api";
import { themes, themeOrder } from "../themes/themes";

const ThemeContext = createContext();

export const themeNames = {
  emerald: "Emerald Green",
  purple: "Royal Purple",
  blue: "Ocean Blue",
  rose: "Crimson Rose",
  dark: "Midnight Dark",
  orange: "Sunset Orange",
};

export const themeSwatches = {
  emerald: "#059669",
  purple: "#7c3aed",
  blue: "#0284c7",
  rose: "#e11d48",
  dark: "#0f172a",
  orange: "#ea580c",
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem("portfolio-theme");
    return saved && themes[saved] ? saved : "purple";
  });
  const [isSaving, setIsSaving] = useState(false);

  // Apply CSS variables to root
  const applyThemeVariables = useCallback((themeKey) => {
    const active = themes[themeKey] || themes.purple;
    const colors = active.colors || active;
    const root = document.documentElement;

    root.setAttribute("data-theme", themeKey);

    Object.entries(colors).forEach(([key, value]) => {
      // standard camelCase CSS variable (e.g. --primaryLight)
      root.style.setProperty(`--${key}`, value);
      // kebab-case CSS variable (e.g. --primary-light)
      const kebab = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
      root.style.setProperty(`--${kebab}`, value);
    });
  }, []);

  // Fetch initial theme from backend database on mount
  useEffect(() => {
    let isMounted = true;

    const fetchTheme = async () => {
      try {
        const response = await API.get("/theme");
        if (response.data && response.data.success && response.data.theme) {
          const apiTheme = response.data.theme.toLowerCase();
          if (themes[apiTheme] && isMounted) {
            setCurrentTheme(apiTheme);
            localStorage.setItem("portfolio-theme", apiTheme);
            applyThemeVariables(apiTheme);
          }
        }
      } catch (error) {
        // Fallback gracefully to saved or default theme
        console.warn("Could not fetch remote theme, using cached theme:", error.message);
      }
    };

    fetchTheme();

    // Cross-tab and in-app event synchronization
    const handleSync = (e) => {
      const updatedTheme = e?.detail || localStorage.getItem("portfolio-theme");
      if (updatedTheme && themes[updatedTheme]) {
        setCurrentTheme(updatedTheme);
        applyThemeVariables(updatedTheme);
      }
    };

    window.addEventListener("portfolio-theme-updated", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      isMounted = false;
      window.removeEventListener("portfolio-theme-updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [applyThemeVariables]);

  // Update CSS variables whenever currentTheme changes
  useEffect(() => {
    applyThemeVariables(currentTheme);
  }, [currentTheme, applyThemeVariables]);

  // Change theme locally (for preview) or permanently
  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  // Save theme permanently to database and sync
  const saveTheme = async (themeName) => {
    if (!themes[themeName]) return false;
    setIsSaving(true);
    try {
      await API.put("/theme", { theme: themeName });
      setCurrentTheme(themeName);
      localStorage.setItem("portfolio-theme", themeName);
      applyThemeVariables(themeName);

      // Dispatch event for other tabs/listeners
      window.dispatchEvent(
        new CustomEvent("portfolio-theme-updated", { detail: themeName })
      );
      return true;
    } catch (error) {
      console.error("Failed to save theme:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const activeTheme = themes[currentTheme] || themes.purple;
  const activeColors = activeTheme.colors || activeTheme;

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        theme: activeTheme,
        themeColors: activeColors,
        themes,
        themeOrder,
        availableThemes: themeOrder,
        themeNames,
        themeSwatches,
        changeTheme,
        saveTheme,
        isSaving,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};