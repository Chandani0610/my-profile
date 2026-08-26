// components/ThemeSwitcher.jsx
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Safely use theme with fallback
  let currentTheme, themes, changeTheme;
  try {
    const theme = useTheme();
    currentTheme = theme.currentTheme;
    themes = theme.themes;
    changeTheme = theme.changeTheme;
  } catch {
    // Fallback if not in provider
    currentTheme = 'blue';
    themes = {
      blue: { primary: '#08bde0' },
      purple: { primary: '#7c3aed' },
      green: { primary: '#059669' },
      red: { primary: '#dc2626' },
      orange: { primary: '#ea580c' },
      dark: { primary: '#1e293b' },
    };
    changeTheme = () => {};
  }

  const themeNames = {
    blue: 'Ocean Blue',
    purple: 'Royal Purple',
    green: 'Emerald Green',
    red: 'Crimson Red',
    orange: 'Sunset Orange',
    dark: 'Dark Mode',
  };

  const themeColors = {
    blue: '#08bde0',
    purple: '#7c3aed',
    green: '#059669',
    red: '#dc2626',
    orange: '#ea580c',
    dark: '#1e293b',
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Only show if themes are available
  if (!themes) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex
          items-center
          gap-1.5
          nav-link
          transition
          duration-300
        "
        style={{
          color: currentTheme === 'home' ? 'var(--primary)' : 'var(--text-secondary)',
        }}
        onMouseEnter={(e) => {
          e.target.style.color = 'var(--primary)';
        }}
        onMouseLeave={(e) => {
          e.target.style.color = 'var(--text-secondary)';
        }}
        aria-label="Change theme"
      >
        <span className="text-base">🎨</span>
        <span className="text-sm">Theme</span>
        <svg
          className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border bg-white/95 py-2 shadow-xl backdrop-blur-xl dark:bg-gray-800/95"
          style={{ borderColor: 'var(--border)' }}
        >
          {Object.keys(themes).map((themeKey) => (
            <button
              key={themeKey}
              onClick={() => {
                changeTheme(themeKey);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                currentTheme === themeKey ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <div
                className="h-5 w-5 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: themeColors[themeKey] }}
              />
              <span className="text-gray-700 dark:text-gray-200">
                {themeNames[themeKey]}
              </span>
              {currentTheme === themeKey && (
                <svg className="ml-auto h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}