import resumeData from "../data/resumeData";
import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
    };
  }

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <footer 
      className="border-t px-6 py-12 text-center transition-all duration-300" 
      style={{ 
        borderColor: themeColors.border,
        backgroundColor: themeColors.primary,
      }}
    >
      {/* Divider */}
      <div className="mx-auto mb-8 max-w-4xl">
        <div className="h-px w-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
      </div>

      {/* Navigation */}
      <nav className="mb-7 flex flex-wrap justify-center gap-x-7 gap-y-3">
        {['home', 'about', 'education', 'skills', 'projects', 'contact'].map((section) => (
          <button
            key={section}
            onClick={() => scrollToSection(section)}
            className="font-semibold transition-all duration-300 hover:scale-105"
            style={{ 
              color: '#ffffff',
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'rgba(255,255,255,0.7)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#ffffff';
            }}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </nav>

      {/* Social Links */}
      <div className="mb-6 flex justify-center gap-5">
        <a
          href={resumeData.contact.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            border
            text-2xl
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-lg
          "
          style={{ 
            borderColor: 'rgba(255,255,255,0.3)',
            backgroundColor: 'transparent',
            color: '#ffffff',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ffffff';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.boxShadow = `0 8px 25px rgba(0,0,0,0.15)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          💼
        </a>

        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            border
            text-2xl
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-lg
          "
          style={{ 
            borderColor: 'rgba(255,255,255,0.3)',
            backgroundColor: 'transparent',
            color: '#ffffff',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ffffff';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.boxShadow = `0 8px 25px rgba(0,0,0,0.15)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          🔗
        </a>

        <a
          href={`mailto:${resumeData.contact.email}`}
          aria-label="Email"
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            border
            text-2xl
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-lg
          "
          style={{ 
            borderColor: 'rgba(255,255,255,0.3)',
            backgroundColor: 'transparent',
            color: '#ffffff',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ffffff';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.boxShadow = `0 8px 25px rgba(0,0,0,0.15)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          📧
        </a>
      </div>

      {/* Copyright */}
      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
        © {currentYear} {resumeData.name} — All Rights Reserved | React Portfolio
      </p>

      {/* Decorative Line */}
      <div 
        className="mx-auto mt-5 h-1 w-16 rounded-full transition-all duration-300 hover:w-24"
        style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
      />
    </footer>
  );
}