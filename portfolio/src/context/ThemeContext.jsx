// context/ThemeContext.jsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const themes = {
  blue: {
    primary: '#08bde0',
    primaryDark: '#07a8c9',
    primaryLight: '#e8f4f8',
    accent: '#48e39a',
    accentDark: '#32d789',
    background: '#f8fafc',
    sectionBg: '#f1f5f9',
    text: '#10243e',
    textSecondary: '#7c8997',
    border: '#e9eef2',
    cardBg: '#ffffff',
    cardBorder: '#e7edf1',
    shadow: 'rgba(16,36,62,0.08)',
    shadowHover: 'rgba(16,36,62,0.12)',
    gradient: 'linear-gradient(135deg, #08bde0, #07a8c9)',
  },
  purple: {
    primary: '#7c3aed',
    primaryDark: '#6d28d9',
    primaryLight: '#ede9fe',
    accent: '#a78bfa',
    accentDark: '#8b5cf6',
    background: '#f8fafc',
    sectionBg: '#f1f5f9',
    text: '#1e1b4b',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    cardBg: '#ffffff',
    cardBorder: '#e5e7eb',
    shadow: 'rgba(124,58,237,0.08)',
    shadowHover: 'rgba(124,58,237,0.15)',
    gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
  },
  green: {
    primary: '#059669',
    primaryDark: '#047857',
    primaryLight: '#ecfdf5',
    accent: '#34d399',
    accentDark: '#10b981',
    background: '#f8fafc',
    sectionBg: '#f1f5f9',
    text: '#064e3b',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    cardBg: '#ffffff',
    cardBorder: '#e5e7eb',
    shadow: 'rgba(5,150,105,0.08)',
    shadowHover: 'rgba(5,150,105,0.15)',
    gradient: 'linear-gradient(135deg, #059669, #047857)',
  },
  red: {
    primary: '#dc2626',
    primaryDark: '#b91c1c',
    primaryLight: '#fef2f2',
    accent: '#f87171',
    accentDark: '#ef4444',
    background: '#f8fafc',
    sectionBg: '#f1f5f9',
    text: '#7f1d1d',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    cardBg: '#ffffff',
    cardBorder: '#e5e7eb',
    shadow: 'rgba(220,38,38,0.08)',
    shadowHover: 'rgba(220,38,38,0.15)',
    gradient: 'linear-gradient(135deg, #dc2626, #b91c1c)',
  },
  orange: {
    primary: '#ea580c',
    primaryDark: '#c2410c',
    primaryLight: '#fff7ed',
    accent: '#fb923c',
    accentDark: '#f97316',
    background: '#f8fafc',
    sectionBg: '#f1f5f9',
    text: '#431407',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    cardBg: '#ffffff',
    cardBorder: '#e5e7eb',
    shadow: 'rgba(234,88,12,0.08)',
    shadowHover: 'rgba(234,88,12,0.15)',
    gradient: 'linear-gradient(135deg, #ea580c, #c2410c)',
  },
  dark: {
    primary: '#3b82f6',
    primaryDark: '#2563eb',
    primaryLight: '#334155',
    accent: '#60a5fa',
    accentDark: '#3b82f6',
    background: '#0f172a',      // ← Added: dark background
    sectionBg: '#111827',       // ← Added: dark section background
    text: '#f1f5f9',           // ← Light text for dark background
    textSecondary: '#94a3b8',  // ← Light secondary text
    border: '#334155',
    cardBg: '#1e293b',
    cardBorder: '#334155',
    shadow: 'rgba(0,0,0,0.3)',
    shadowHover: 'rgba(0,0,0,0.4)',
    gradient: 'linear-gradient(135deg, #1e293b, #0f172a)',
  }
};

// Theme display names for the switcher
export const themeNames = {
  blue: 'Ocean Blue',
  purple: 'Royal Purple',
  green: 'Emerald Green',
  red: 'Crimson Red',
  orange: 'Sunset Orange',
  dark: 'Dark Mode',
};

// Theme color swatches for the switcher
export const themeSwatches = {
  blue: '#08bde0',
  purple: '#7c3aed',
  green: '#059669',
  red: '#dc2626',
  orange: '#ea580c',
  dark: '#3b82f6',
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('portfolio-theme');
    return savedTheme && themes[savedTheme] ? savedTheme : 'blue';
  });

  useEffect(() => {
    localStorage.setItem('portfolio-theme', currentTheme);
    
    // Set CSS variables for global access
    const theme = themes[currentTheme];
    const root = document.documentElement;
    
    // Set all theme properties as CSS variables
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    
    // Also set convenience variables for common use
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--primary-dark', theme.primaryDark);
    root.style.setProperty('--primary-light', theme.primaryLight);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--text', theme.text);
    root.style.setProperty('--text-secondary', theme.textSecondary);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--section-bg', theme.sectionBg);
    root.style.setProperty('--card-bg', theme.cardBg);
    root.style.setProperty('--shadow', theme.shadow);
    root.style.setProperty('--shadow-hover', theme.shadowHover);
    
  }, [currentTheme]);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      themes, 
      changeTheme,
      themeColors: themes[currentTheme],
      themeNames,
      themeSwatches,
      availableThemes: Object.keys(themes),
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};