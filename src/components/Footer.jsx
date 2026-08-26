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
    <footer className="border-t px-6 py-12 text-center" style={{ 
      borderColor: themeColors.border,
      backgroundColor: '#f8fafb'
    }}>
      
      {/* Contact Section */}
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-2 text-2xl font-bold" style={{ color: themeColors.text }}>
          Let's Work Together
        </h2>

        <p className="mb-6 text-sm" style={{ color: themeColors.textSecondary }}>
          Reach out for collaborations, freelance work, or to discuss your next project idea.
        </p>

        {/* Contact Info Grid */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Email */}
          <a
            href={`mailto:${resumeData.contact.email}`}
            className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ 
              borderColor: themeColors.border,
              color: themeColors.textSecondary,
              hoverBorderColor: themeColors.primary,
              hoverColor: themeColors.primary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = themeColors.primary;
              e.currentTarget.style.color = themeColors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = themeColors.border;
              e.currentTarget.style.color = themeColors.textSecondary;
            }}
          >
            <span>📧</span>
            <span>{resumeData.contact.email}</span>
          </a>

          {/* LinkedIn */}
          <a
            href={resumeData.contact.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ 
              borderColor: themeColors.border,
              color: themeColors.textSecondary,
              hoverBorderColor: themeColors.primary,
              hoverColor: themeColors.primary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = themeColors.primary;
              e.currentTarget.style.color = themeColors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = themeColors.border;
              e.currentTarget.style.color = themeColors.textSecondary;
            }}
          >
            <span>💼</span>
            <span>LinkedIn</span>
          </a>

          {/* Location */}
          <div
            className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm"
            style={{ 
              borderColor: themeColors.border,
              color: themeColors.textSecondary
            }}
          >
            <span>📍</span>
            <span>{resumeData.contact.location}</span>
          </div>

          {/* Phone */}
          <a
            href={`tel:${resumeData.contact.phone}`}
            className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ 
              borderColor: themeColors.border,
              color: themeColors.textSecondary,
              hoverBorderColor: themeColors.primary,
              hoverColor: themeColors.primary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = themeColors.primary;
              e.currentTarget.style.color = themeColors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = themeColors.border;
              e.currentTarget.style.color = themeColors.textSecondary;
            }}
          >
            <span>📞</span>
            <span>{resumeData.contact.phone}</span>
          </a>

        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto mb-8 max-w-4xl">
        <div className="h-px w-full" style={{ backgroundColor: themeColors.border }} />
      </div>

      {/* Navigation */}
      <nav className="mb-7 flex flex-wrap justify-center gap-x-7 gap-y-3">
        <button
          onClick={() => scrollToSection("home")}
          className="font-semibold transition-colors duration-300"
          style={{ 
            color: themeColors.textSecondary,
            hoverColor: themeColors.primary
          }}
          onMouseEnter={(e) => e.target.style.color = themeColors.primary}
          onMouseLeave={(e) => e.target.style.color = themeColors.textSecondary}
        >
          Home
        </button>

        <button
          onClick={() => scrollToSection("about")}
          className="font-semibold transition-colors duration-300"
          style={{ 
            color: themeColors.textSecondary,
            hoverColor: themeColors.primary
          }}
          onMouseEnter={(e) => e.target.style.color = themeColors.primary}
          onMouseLeave={(e) => e.target.style.color = themeColors.textSecondary}
        >
          About
        </button>

        <button
          onClick={() => scrollToSection("education")}
          className="font-semibold transition-colors duration-300"
          style={{ 
            color: themeColors.textSecondary,
            hoverColor: themeColors.primary
          }}
          onMouseEnter={(e) => e.target.style.color = themeColors.primary}
          onMouseLeave={(e) => e.target.style.color = themeColors.textSecondary}
        >
          Education
        </button>

        <button
          onClick={() => scrollToSection("skills")}
          className="font-semibold transition-colors duration-300"
          style={{ 
            color: themeColors.textSecondary,
            hoverColor: themeColors.primary
          }}
          onMouseEnter={(e) => e.target.style.color = themeColors.primary}
          onMouseLeave={(e) => e.target.style.color = themeColors.textSecondary}
        >
          Skills
        </button>

        <button
          onClick={() => scrollToSection("projects")}
          className="font-semibold transition-colors duration-300"
          style={{ 
            color: themeColors.textSecondary,
            hoverColor: themeColors.primary
          }}
          onMouseEnter={(e) => e.target.style.color = themeColors.primary}
          onMouseLeave={(e) => e.target.style.color = themeColors.textSecondary}
        >
          Projects
        </button>

        <button
          onClick={() => scrollToSection("contact")}
          className="font-semibold transition-colors duration-300"
          style={{ 
            color: themeColors.textSecondary,
            hoverColor: themeColors.primary
          }}
          onMouseEnter={(e) => e.target.style.color = themeColors.primary}
          onMouseLeave={(e) => e.target.style.color = themeColors.textSecondary}
        >
          Contact
        </button>
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
            borderColor: themeColors.border,
            backgroundColor: themeColors.cardBg,
            color: themeColors.textSecondary,
            hoverBorderColor: themeColors.primary,
            hoverColor: themeColors.primary,
            hoverBackgroundColor: `${themeColors.primary}10`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = themeColors.primary;
            e.currentTarget.style.color = themeColors.primary;
            e.currentTarget.style.backgroundColor = `${themeColors.primary}10`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = themeColors.border;
            e.currentTarget.style.color = themeColors.textSecondary;
            e.currentTarget.style.backgroundColor = themeColors.cardBg;
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
            borderColor: themeColors.border,
            backgroundColor: themeColors.cardBg,
            color: themeColors.textSecondary,
            hoverBorderColor: themeColors.primary,
            hoverColor: themeColors.primary,
            hoverBackgroundColor: `${themeColors.primary}10`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = themeColors.primary;
            e.currentTarget.style.color = themeColors.primary;
            e.currentTarget.style.backgroundColor = `${themeColors.primary}10`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = themeColors.border;
            e.currentTarget.style.color = themeColors.textSecondary;
            e.currentTarget.style.backgroundColor = themeColors.cardBg;
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
            borderColor: themeColors.border,
            backgroundColor: themeColors.cardBg,
            color: themeColors.textSecondary,
            hoverBorderColor: themeColors.primary,
            hoverColor: themeColors.primary,
            hoverBackgroundColor: `${themeColors.primary}10`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = themeColors.primary;
            e.currentTarget.style.color = themeColors.primary;
            e.currentTarget.style.backgroundColor = `${themeColors.primary}10`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = themeColors.border;
            e.currentTarget.style.color = themeColors.textSecondary;
            e.currentTarget.style.backgroundColor = themeColors.cardBg;
          }}
        >
          📧
        </a>
      </div>

      {/* Copyright */}
      <p className="text-sm" style={{ color: themeColors.textSecondary }}>
        © {currentYear} {resumeData.name} — All Rights Reserved | React Portfolio
      </p>

      {/* Decorative Line */}
      <div 
        className="mx-auto mt-5 h-1 w-16 rounded-full transition-all duration-300"
        style={{ backgroundColor: themeColors.primary }}
      />
    </footer>
  );
}