import resumeData from "../data/resumeData";
import { useTheme } from "../context/ThemeContext";

export default function Education() {
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

  // Education icons
  const eduIcons = ['🎓', '📚', '🏫'];

  return (
    <section 
      id="education" 
      className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-28"
      style={{ backgroundColor: themeColors.sectionBg }}
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-[650px] text-center">

          <p className="text-sm uppercase tracking-[0.28em]" style={{ color: themeColors.primary }}>
            Education
          </p>

          <h2 className="m-0 text-4xl font-bold tracking-[-1.5px]" style={{ color: themeColors.text }}>
            Academic Background
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm" style={{ color: themeColors.textSecondary }}>
            Strong academic foundation combined with certifications and
            language skills that support my technical and professional growth.
          </p>

        </div>

        {/* Education Cards */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

          {resumeData.education.map((item, idx) => (
            <div
              key={idx}
              className="
                group
                rounded-2xl
                border
                p-8
                transition-all
                duration-300
                hover:-translate-y-2
              "
              style={{ 
                borderColor: themeColors.border,
                backgroundColor: themeColors.cardBg,
                boxShadow: `0 12px 35px ${themeColors.shadow}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 20px 45px ${themeColors.shadowHover}`;
                e.currentTarget.style.borderColor = themeColors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 12px 35px ${themeColors.shadow}`;
                e.currentTarget.style.borderColor = themeColors.border;
              }}
            >
              <div 
                className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{ 
                  backgroundColor: `${themeColors.primary}15`,
                  border: `1px solid ${themeColors.primary}30`,
                  color: themeColors.primary
                }}
              >
                {eduIcons[idx % eduIcons.length] || '🎓'}
              </div>

              <h3 className="text-2xl font-semibold transition-colors duration-300 group-hover:text-[var(--primary)]" style={{ color: themeColors.text }}>
                {item.degree}
              </h3>

              <p className="mt-3 text-sm" style={{ color: themeColors.textSecondary }}>
                {item.college}
              </p>

              <div 
                className="mt-4 inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
                style={{ 
                  backgroundColor: `${themeColors.accent}15`,
                  border: `1px solid ${themeColors.accent}30`,
                  color: themeColors.accent,
                  boxShadow: `0 2px 8px ${themeColors.accent}20`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 15px ${themeColors.accent}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 2px 8px ${themeColors.accent}20`;
                }}
              >
                {item.marks}
              </div>

              <p className="mt-3 text-xs" style={{ color: themeColors.textSecondary }}>
                {item.year}
              </p>

              {/* Decorative indicator */}
              <div 
                className="mt-4 h-0.5 w-12 rounded-full transition-all duration-300 group-hover:w-full group-hover:h-1"
                style={{ backgroundColor: `${themeColors.primary}30` }}
              />
            </div>
          ))}

        </div>

        {/* Certifications + Languages */}
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">

          {/* Certifications */}
          <div
            className="
              group
              rounded-2xl
              border
              p-8
              transition-all
              duration-300
              hover:-translate-y-2
            "
            style={{ 
              borderColor: themeColors.border,
              backgroundColor: themeColors.cardBg,
              boxShadow: `0 12px 35px ${themeColors.shadow}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 20px 45px ${themeColors.shadowHover}`;
              e.currentTarget.style.borderColor = themeColors.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 12px 35px ${themeColors.shadow}`;
              e.currentTarget.style.borderColor = themeColors.border;
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{ 
                  backgroundColor: `${themeColors.accent}15`,
                  border: `1px solid ${themeColors.accent}30`,
                  color: themeColors.accent
                }}
              >
                🏅
              </div>

              <h3 className="text-2xl font-semibold transition-colors duration-300 group-hover:text-[var(--accent)]" style={{ color: themeColors.text }}>
                Certifications
              </h3>
            </div>

            <div className="space-y-4">
              {resumeData.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 text-sm transition-all duration-200 hover:translate-x-2"
                  style={{ color: themeColors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = themeColors.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = themeColors.textSecondary;
                  }}
                >
                  <span className="mt-1 transition-transform duration-200 group-hover:scale-125" style={{ color: themeColors.accent }}>
                    ✔
                  </span>
                  <span>{cert}</span>
                </div>
              ))}
            </div>

            {/* Decorative indicator */}
            <div 
              className="mt-6 h-0.5 w-12 rounded-full transition-all duration-300 group-hover:w-full group-hover:h-1"
              style={{ backgroundColor: `${themeColors.accent}30` }}
            />
          </div>

          {/* Languages */}
          <div
            className="
              group
              rounded-2xl
              border
              p-8
              transition-all
              duration-300
              hover:-translate-y-2
            "
            style={{ 
              borderColor: themeColors.border,
              backgroundColor: themeColors.cardBg,
              boxShadow: `0 12px 35px ${themeColors.shadow}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 20px 45px ${themeColors.shadowHover}`;
              e.currentTarget.style.borderColor = themeColors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 12px 35px ${themeColors.shadow}`;
              e.currentTarget.style.borderColor = themeColors.border;
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{ 
                  backgroundColor: `${themeColors.primary}15`,
                  border: `1px solid ${themeColors.primary}30`,
                  color: themeColors.primary
                }}
              >
                🌐
              </div>

              <h3 className="text-2xl font-semibold transition-colors duration-300 group-hover:text-[var(--primary)]" style={{ color: themeColors.text }}>
                Languages
              </h3>
            </div>

            <div className="flex flex-wrap gap-3">
              {resumeData.languages.map((lang) => (
                <span
                  key={lang.name}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition-all
                    duration-200
                    hover:scale-105
                    hover:shadow-md
                  "
                  style={{ 
                    backgroundColor: `${themeColors.primary}15`,
                    border: `1px solid ${themeColors.primary}30`,
                    color: themeColors.primary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${themeColors.primary}25`;
                    e.currentTarget.style.borderColor = themeColors.primary;
                    e.currentTarget.style.boxShadow = `0 4px 12px ${themeColors.primary}25`;
                    e.currentTarget.style.color = themeColors.primaryDark;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${themeColors.primary}15`;
                    e.currentTarget.style.borderColor = `${themeColors.primary}30`;
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.color = themeColors.primary;
                  }}
                >
                  {lang.flag} {lang.name}
                  <span className="text-xs" style={{ color: themeColors.textSecondary }}>
                    ({lang.level})
                  </span>
                </span>
              ))}
            </div>

            {/* Decorative indicator */}
            <div 
              className="mt-6 h-0.5 w-12 rounded-full transition-all duration-300 group-hover:w-full group-hover:h-1"
              style={{ backgroundColor: `${themeColors.primary}30` }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}