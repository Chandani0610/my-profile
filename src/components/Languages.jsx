import resumeData from "../data/resumeData";
import { useTheme } from "../context/ThemeContext";

export default function Languages() {
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

  // Get level color based on theme
  const getLevelColor = (level) => {
    const colors = {
      'Native': { 
        bg: `${themeColors.accent}15`, 
        border: `${themeColors.accent}30`, 
        text: themeColors.accent 
      },
      'Fluent': { 
        bg: `${themeColors.primary}15`, 
        border: `${themeColors.primary}30`, 
        text: themeColors.primary 
      },
      'Mother Tongue': { 
        bg: `${themeColors.primary}10`, 
        border: `${themeColors.primary}25`, 
        text: themeColors.primary 
      },
      'Professional': { 
        bg: `${themeColors.accent}10`, 
        border: `${themeColors.accent}25`, 
        text: themeColors.accent 
      },
    };
    return colors[level] || colors['Fluent'];
  };

  // Level badge styles
  const getLevelBadge = (level) => {
    const badges = {
      'Native': '🌟 Native',
      'Fluent': '💪 Fluent',
      'Mother Tongue': '❤️ Mother Tongue',
      'Professional': '💼 Professional',
    };
    return badges[level] || level;
  };

  return (
    <section 
      id="languages" 
      className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-28"
      style={{ backgroundColor: themeColors.sectionBg }}
    >
      <div className="mx-auto max-w-7xl">

        <div className="mx-auto mb-14 max-w-[650px] text-center">

          <p className="text-sm uppercase tracking-[0.28em]" style={{ color: themeColors.primary }}>
            Languages
          </p>

          <h2 className="m-0 text-4xl font-bold tracking-[-1.5px]" style={{ color: themeColors.text }}>
            Languages I Speak
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm" style={{ color: themeColors.textSecondary }}>
            Languages I can communicate in, along with my proficiency level.
          </p>

        </div>

        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-5">

          {resumeData.languages.map((lang, idx) => {
            const levelColor = getLevelColor(lang.level);
            return (
              <div
                key={idx}
                className="
                  group
                  min-w-[220px]
                  rounded-2xl
                  border
                  px-6
                  py-5
                  transition-all
                  duration-300
                  hover:-translate-y-2
                "
                style={{ 
                  borderColor: themeColors.border,
                  backgroundColor: themeColors.cardBg,
                  boxShadow: `0 8px 25px ${themeColors.shadow}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 45px ${themeColors.shadowHover}`;
                  e.currentTarget.style.borderColor = levelColor.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 8px 25px ${themeColors.shadow}`;
                  e.currentTarget.style.borderColor = themeColors.border;
                }}
              >
                <div className="flex items-center gap-4">
                  
                  {/* Language Flag */}
                  <div 
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl transition-all duration-300 group-hover:scale-110"
                    style={{ 
                      backgroundColor: levelColor.bg,
                      border: `1px solid ${levelColor.border}`,
                      color: levelColor.text
                    }}
                  >
                    {lang.flag}
                  </div>

                  {/* Language Details */}
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="font-semibold transition-colors duration-300"
                      style={{ color: themeColors.text }}
                      onMouseEnter={(e) => e.target.style.color = levelColor.text}
                      onMouseLeave={(e) => e.target.style.color = themeColors.text}
                    >
                      {lang.name}
                    </h3>

                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <span 
                        className="text-xs font-medium"
                        style={{ color: levelColor.text }}
                      >
                        {getLevelBadge(lang.level)}
                      </span>
                      
                      {/* Level indicator dots */}
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => {
                          const filled = i < (lang.level === 'Native' || lang.level === 'Mother Tongue' ? 5 : 
                                           lang.level === 'Fluent' ? 4 : 3);
                          return (
                            <div
                              key={i}
                              className="h-1.5 w-4 rounded-full transition-all duration-300 group-hover:h-2"
                              style={{ 
                                backgroundColor: filled ? levelColor.text : `${levelColor.text}30`,
                                opacity: filled ? 1 : 0.3
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <span 
                    className="text-sm transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110"
                    style={{ color: levelColor.text }}
                  >
                    →
                  </span>
                </div>
              </div>
            );
          })}

        </div>

        {/* Language Stats */}
        <div className="mx-auto mt-12 max-w-3xl">
          <div 
            className="grid grid-cols-3 gap-4 rounded-2xl border p-8 text-center"
            style={{ 
              borderColor: themeColors.border,
              backgroundColor: `${themeColors.primary}05`
            }}
          >
            <div>
              <p className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                {resumeData.languages.length}
              </p>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                Total Languages
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                {resumeData.languages.filter(l => l.level === 'Native' || l.level === 'Mother Tongue').length}
              </p>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                Native Languages
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                {resumeData.languages.filter(l => l.level === 'Fluent' || l.level === 'Professional').length}
              </p>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                Fluent Languages
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}