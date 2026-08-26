import resumeData from "../data/resumeData";
import { useTheme } from "../context/ThemeContext";

export default function Certifications() {
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

  // Certification icons
  const certIcons = ['🏅', '📜', '🎯', '⭐', '🏆', '📋'];

  return (
    <section 
      id="certifications" 
      className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-28"
      style={{ backgroundColor: themeColors.sectionBg }}
    >
      <div className="mx-auto max-w-7xl">

        <div className="mx-auto mb-14 max-w-[650px] text-center">

          <p className="text-sm uppercase tracking-[0.28em]" style={{ color: themeColors.primary }}>
            Certifications
          </p>

          <h2 className="m-0 text-4xl font-bold tracking-[-1.5px]" style={{ color: themeColors.text }}>
            Professional Certifications
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm" style={{ color: themeColors.textSecondary }}>
            Certifications that support my technical knowledge and professional development.
          </p>

        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">

          {resumeData.certifications.map((cert, idx) => (
            <div
              key={idx}
              className="
                group
                rounded-2xl
                border
                p-8
                text-center
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
              <div className="flex flex-col items-center justify-center">
                
                <div 
                  className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl text-4xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                  style={{ 
                    backgroundColor: `${themeColors.primary}15`,
                    border: `1px solid ${themeColors.primary}30`,
                    color: themeColors.primary
                  }}
                >
                  {certIcons[idx % certIcons.length] || '🏅'}
                </div>

                <h3 
                  className="mb-3 text-xl font-semibold leading-relaxed transition-colors duration-300 md:text-2xl group-hover:text-[var(--accent)]"
                  style={{ color: themeColors.text }}
                >
                  {cert}
                </h3>

                <div 
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
                  style={{ 
                    backgroundColor: `${themeColors.accent}15`,
                    border: `1px solid ${themeColors.accent}30`,
                    color: themeColors.accent,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${themeColors.accent}25`;
                    e.currentTarget.style.borderColor = themeColors.accent;
                    e.currentTarget.style.boxShadow = `0 4px 12px ${themeColors.accent}25`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${themeColors.accent}15`;
                    e.currentTarget.style.borderColor = `${themeColors.accent}30`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span className="transition-transform duration-200 group-hover:scale-125">✔</span>
                  Certified
                </div>

                {/* Decorative indicator */}
                <div 
                  className="mt-4 h-0.5 w-12 rounded-full transition-all duration-300 group-hover:w-full group-hover:h-1"
                  style={{ backgroundColor: `${themeColors.accent}30` }}
                />
              </div>
            </div>
          ))}

        </div>

        {/* Stats Section */}
        <div className="mx-auto mt-12 max-w-3xl">
          <div 
            className="grid grid-cols-2 gap-4 rounded-2xl border p-8 text-center md:grid-cols-4 transition-all duration-300 hover:shadow-md"
            style={{ 
              borderColor: themeColors.border,
              backgroundColor: `${themeColors.primary}05`,
              boxShadow: `0 4px 15px ${themeColors.shadow}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 12px 35px ${themeColors.shadowHover}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 4px 15px ${themeColors.shadow}`;
            }}
          >
            <div className="transition-all duration-300 hover:scale-105">
              <p className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                {resumeData.certifications.length}
              </p>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                Total Certifications
              </p>
            </div>
            <div className="transition-all duration-300 hover:scale-105">
              <p className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                {resumeData.certifications.filter(c => c.includes('NPTEL')).length}
              </p>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                NPTEL Courses
              </p>
            </div>
            <div className="transition-all duration-300 hover:scale-105">
              <p className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                {resumeData.certifications.filter(c => c.includes('HackerRank')).length}
              </p>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                HackerRank
              </p>
            </div>
            <div className="transition-all duration-300 hover:scale-105">
              <p className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                2024-{new Date().getFullYear()}
              </p>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                Active Period
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}