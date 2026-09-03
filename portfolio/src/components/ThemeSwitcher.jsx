// components/ThemeSwitcher.jsx
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Safely use theme with fallback
  let currentTheme, themes, changeTheme, themeColors;
  try {
    const theme = useTheme();
    currentTheme = theme.currentTheme;
    themes = theme.themes;
    changeTheme = theme.changeTheme;
    themeColors = theme.themeColors;
  } catch {
    // Fallback if not in provider
    currentTheme = 'blue';
    themes = {
      blue: { primary: '#08bde0' },
      purple: { primary: '#7c3aed' },
      green: { primary: '#059669' },
      red: { primary: '#dc2626' },
      orange: { primary: '#ea580c' },
      dark: { primary: '#0f172a' },
    };
    themeColors = {
      text: '#0f172a',
      textSecondary: '#475569',
      border: '#e2e8f0',
      cardBg: '#ffffff',
      primary: '#08bde0',
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

  const themeColorSwatches = {
    blue: '#08bde0',
    purple: '#7c3aed',
    green: '#059669',
    red: '#dc2626',
    orange: '#ea580c',
    dark: '#38bdf8',
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
          px-3
          py-2
          rounded-xl
          border
          border-white/10
          hover:border-white/20
        "
        style={{
          color: 'var(--text-secondary)',
          backgroundColor: 'rgba(255,255,255,0.05)',
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
        <div 
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl py-2 shadow-2xl"
          style={{
            backgroundColor: themeColors?.cardBg || '#ffffff',
            border: `1px solid var(--border)`,
            boxShadow: `0 20px 60px var(--shadow-hover)`,
            zIndex: 9999, // ✅ High z-index to appear above everything
          }}
        >
          {Object.keys(themes).map((themeKey) => (
            <button
              key={themeKey}
              onClick={() => {
                changeTheme(themeKey);
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors"
              style={{
                color: 'var(--text)',
                backgroundColor: currentTheme === themeKey 
                  ? 'var(--primary-light)' 
                  : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (currentTheme !== themeKey) {
                  e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentTheme !== themeKey) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div
                className="h-5 w-5 rounded-full border-2 flex-shrink-0"
                style={{
                  backgroundColor: themeColorSwatches[themeKey] || '#ccc',
                  borderColor: 'var(--border)',
                }}
              />
              <span style={{ color: 'var(--text)' }}>
                {themeNames[themeKey]}
              </span>
              {currentTheme === themeKey && (
                <svg 
                  className="ml-auto h-4 w-4" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  style={{ color: 'var(--primary)' }}
                >
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