// context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const themes = {
  blue: {
    primary: '#08bde0',
    primaryDark: '#07a8c9',
    primaryLight: '#e8f4f8',
    accent: '#48e39a',
    accentDark: '#32d789',
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
    primaryLight: '#1e293b',
    accent: '#60a5fa',
    accentDark: '#3b82f6',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    cardBg: '#1e293b',
    cardBorder: '#334155',
    shadow: 'rgba(0,0,0,0.3)',
    shadowHover: 'rgba(0,0,0,0.4)',
    gradient: 'linear-gradient(135deg, #1e293b, #0f172a)',
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('portfolio-theme');
    return savedTheme || 'blue';
  });

  useEffect(() => {
    localStorage.setItem('portfolio-theme', currentTheme);
    document.documentElement.style.setProperty('--theme-primary', themes[currentTheme].primary);
    document.documentElement.style.setProperty('--theme-primary-dark', themes[currentTheme].primaryDark);
    document.documentElement.style.setProperty('--theme-accent', themes[currentTheme].accent);
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
      themeColors: themes[currentTheme] 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// The hook is intentionally colocated with its provider so both share the same context.
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};