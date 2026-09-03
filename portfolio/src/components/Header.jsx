// components/Header.jsx
import { useState } from "react";
import profileImage from "../assets/photo (2).jpg";
import resumeData from "../data/resumeData";
import ThemeSwitcher from "./ThemeSwitcher";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Safely use theme with fallback
  let themeColors;
  try {
    const theme = useTheme();
    themeColors = theme.themeColors;
  } catch {
    // Fallback theme if not in provider
    themeColors = {
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
      background: '#f8fafb',
      sectionBg: '#ffffff',
      shadow: 'rgba(16,36,62,0.08)',
      shadowHover: 'rgba(16,36,62,0.12)',
      gradient: 'linear-gradient(135deg, #08bde0, #07a8c9)',
    };
  }

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
    closeMenu();
  };

  // Navigation items
  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <header 
        className="sticky top-0 z-50 hidden border-b shadow-sm md:block"
        style={{ 
          backgroundColor: themeColors.cardBg,
          borderColor: themeColors.border,
        }}
      >
        <nav 
          className="mx-auto flex max-w-7xl items-center justify-between px-6" 
          style={{ minHeight: '75px', paddingTop: '10px', paddingBottom: '10px' }}
        >
          <div className="flex items-center gap-3">
            <img 
              src={profileImage} 
              alt={resumeData.name || "Profile"} 
              className="h-11 w-11 rounded-full border-2 object-cover"
              style={{ borderColor: themeColors.primary }}
            />
            <h1 
              className="text-2xl font-bold tracking-tight md:text-3xl"
              style={{ color: themeColors.text }}
            >
              {resumeData.name?.split(" ")[0] || "Chandani"}
              <span style={{ color: themeColors.primary }}>
                {" "}{resumeData.name?.split(" ")[1] || "Kumari"}
              </span>
            </h1>
          </div>
          <ul className="flex items-center gap-8 text-sm font-medium">
            {navItems.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => scrollToSection(item.id)}
                  className={`nav-link transition ${
                    item.id === "home" ? "font-semibold" : ""
                  }`}
                  style={{
                    color: item.id === "home" ? themeColors.primary : themeColors.textSecondary,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = themeColors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = item.id === "home" ? themeColors.primary : themeColors.textSecondary;
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
            
            <li>
              <ThemeSwitcher />
            </li>
            <li>
              <button 
                onClick={() => scrollToSection("contact")}
                className="
                  rounded-full
                  px-5 py-2
                  text-xs
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-lg
                "
                style={{ 
                  backgroundColor: themeColors.primary,
                  boxShadow: `0 4px 15px ${themeColors.primary}30`
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = themeColors.primaryDark;
                  e.target.style.boxShadow = `0 8px 25px ${themeColors.primary}40`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = themeColors.primary;
                  e.target.style.boxShadow = `0 4px 15px ${themeColors.primary}30`;
                }}
              >
                Let's Talk
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Mobile Navigation */}
      <header 
        className="sticky top-0 z-50 border-b shadow-sm md:hidden"
        style={{ 
          backgroundColor: themeColors.cardBg,
          borderColor: themeColors.border,
        }}
      >
        <nav 
          className="flex items-center justify-between px-4" 
          style={{ minHeight: '70px', paddingTop: '10px', paddingBottom: '10px' }}
        >
          <div className="flex items-center gap-3">
            <img 
              src={profileImage} 
              alt={resumeData.name || "Profile"} 
              className="h-10 w-10 rounded-full border-2 object-cover"
              style={{ borderColor: themeColors.primary }}
            />
            <h1 
              className="text-base font-bold"
              style={{ color: themeColors.text }}
            >
              {resumeData.name?.split(" ")[0] || "Chandani"}
              <span style={{ color: themeColors.primary }}>
                {" "}{resumeData.name?.split(" ")[1] || "Kumari"}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleMenu} className="focus:outline-none">
              <svg 
                className="h-7 w-7"
                style={{ color: themeColors.text }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>
        {mobileMenuOpen && (
          <div 
            className="flex flex-col gap-2 border-t px-6 py-4 shadow-lg"
            style={{ 
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border,
            }}
          >
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`py-2.5 text-left text-base transition ${
                  item.id === "home" ? "font-semibold" : "font-medium"
                }`}
                style={{
                  color: item.id === "home" ? themeColors.primary : themeColors.text,
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = themeColors.primary;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = item.id === "home" ? themeColors.primary : themeColors.text;
                }}
              >
                {item.label}
              </button>
            ))}
            
            {/* Theme Section - Mobile */}
            <div className="mt-2 border-t pt-3" style={{ borderColor: themeColors.border }}>
              <div className="flex items-center justify-between">
                <span 
                  className="text-sm font-medium"
                  style={{ color: themeColors.text }}
                >
                  🎨 Theme
                </span>
                <ThemeSwitcher />
              </div>
            </div>

            <button 
              onClick={() => scrollToSection("contact")}
              className="
                mt-2
                rounded-full
                px-5 py-3
                text-center
                text-sm
                font-semibold
                text-white
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-lg
              "
              style={{ 
                backgroundColor: themeColors.primary,
                boxShadow: `0 4px 15px ${themeColors.primary}30`
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = themeColors.primaryDark;
                e.target.style.boxShadow = `0 8px 25px ${themeColors.primary}40`;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = themeColors.primary;
                e.target.style.boxShadow = `0 4px 15px ${themeColors.primary}30`;
              }}
            >
              Let's Talk
            </button>
          </div>
        )}
      </header>
    </>
  );
}