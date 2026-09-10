// context/ThemeContext.jsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
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

// Cross-tab broadcast channel
const channelName = "portfolio_global_theme_channel";
const getChannel = () => {
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    try {
      return new BroadcastChannel(channelName);
    } catch {
      return null;
    }
  }
  return null;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("portfolio-theme") : null;
    return saved && themes[saved] ? saved : "purple";
  });
  const [isSaving, setIsSaving] = useState(false);
  const channelRef = useRef(null);

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

  // Sync state and DOM with a new theme name
  const activateThemeLocally = useCallback((newTheme) => {
    if (newTheme && themes[newTheme]) {
      setCurrentTheme(newTheme);
      localStorage.setItem("portfolio-theme", newTheme);
      applyThemeVariables(newTheme);
    }
  }, [applyThemeVariables]);

  // Fetch initial theme from backend database on mount
  useEffect(() => {
    let isMounted = true;
    channelRef.current = getChannel();

    const fetchThemeFromBackend = async () => {
      try {
        const response = await API.get("/theme");
        if (response.data && response.data.success && response.data.theme) {
          const apiTheme = String(response.data.theme).toLowerCase();
          if (themes[apiTheme] && isMounted) {
            activateThemeLocally(apiTheme);
          }
        }
      } catch (error) {
        console.warn("Using cached theme fallback:", error.message);
      }
    };

    // Initial load
    fetchThemeFromBackend();

    // 1. Listen for BroadcastChannel messages across tabs
    if (channelRef.current) {
      channelRef.current.onmessage = (event) => {
        if (event.data?.type === "THEME_UPDATED" && event.data.theme) {
          const incomingTheme = String(event.data.theme).toLowerCase();
          if (themes[incomingTheme] && isMounted) {
            activateThemeLocally(incomingTheme);
          }
        }
      };
    }

    // 2. Listen for in-app CustomEvent and window Storage events
    const handleSync = (e) => {
      const updatedTheme = e?.detail || e?.newValue || localStorage.getItem("portfolio-theme");
      if (updatedTheme && themes[updatedTheme] && isMounted) {
        activateThemeLocally(updatedTheme);
      }
    };

    window.addEventListener("portfolio-theme-updated", handleSync);
    window.addEventListener("storage", handleSync);

    // 3. Re-check on tab focus / visibility change
    const handleFocus = () => {
      fetchThemeFromBackend();
    };
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        fetchThemeFromBackend();
      }
    });

    // 4. Background polling (every 3 seconds) for guaranteed cross-device/browser sync
    const pollInterval = setInterval(() => {
      fetchThemeFromBackend();
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      window.removeEventListener("portfolio-theme-updated", handleSync);
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("focus", handleFocus);
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, [activateThemeLocally]);

  // Update CSS variables whenever currentTheme changes
  useEffect(() => {
    applyThemeVariables(currentTheme);
  }, [currentTheme, applyThemeVariables]);

  // Temporary preview change
  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  // Save theme permanently to database and broadcast to all tabs
  const saveTheme = async (themeName) => {
    if (!themes[themeName]) return false;
    setIsSaving(true);
    try {
      await API.put("/theme", { theme: themeName });
      
      // Update local state and root CSS variables immediately
      activateThemeLocally(themeName);

      // 1. Broadcast to all other tabs via BroadcastChannel
      if (channelRef.current) {
        channelRef.current.postMessage({
          type: "THEME_UPDATED",
          theme: themeName,
        });
      }

      // 2. Dispatch custom event for current window
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