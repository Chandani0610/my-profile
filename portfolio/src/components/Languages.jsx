import { useTheme } from "../context/ThemeContext";

export default function Languages({ languages }) {
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

  // Use props or fallback data
  const languagesData = languages || [
    { name: "English", level: "Fluent", flag: "🇬🇧" },
    { name: "Nepali", level: "Native", flag: "🇳🇵" },
    { name: "Hindi", level: "Professional", flag: "🇮🇳" },
  ];

  // Default flags for common languages if not provided
  const defaultFlags = {
    'English': '🇬🇧',
    'Nepali': '🇳🇵',
    'Hindi': '🇮🇳',
    'Spanish': '🇪🇸',
    'French': '🇫🇷',
    'German': '🇩🇪',
    'Chinese': '🇨🇳',
    'Japanese': '🇯🇵',
    'Korean': '🇰🇷',
    'Russian': '🇷🇺',
    'Arabic': '🇸🇦',
    'Portuguese': '🇵🇹',
    'Italian': '🇮🇹',
    'Dutch': '🇳🇱',
    'Bengali': '🇧🇩',
    'Urdu': '🇵🇰',
    'Tamil': '🇮🇳',
    'Telugu': '🇮🇳',
    'Marathi': '🇮🇳',
    'Gujarati': '🇮🇳',
    'Punjabi': '🇮🇳',
  };

  // Get level color based on theme
  const getLevelColor = (level) => {
    const colors = {
      'Native': { 
        bg: `${themeColors.primaryDark}15`, 
        border: `${themeColors.primaryDark}30`, 
        text: themeColors.primaryDark
      },
      'Fluent': { 
        bg: `${themeColors.primaryDark}15`, 
        border: `${themeColors.primaryDark}30`, 
        text: themeColors.primaryDark 
      },
      'Mother Tongue': { 
        bg: `${themeColors.primaryDark}10`, 
        border: `${themeColors.primaryDark}25`, 
        text: themeColors.primaryDark 
      },
      'Professional': { 
        bg: `${themeColors.primaryDark}10`, 
        border: `${themeColors.primaryDark}25`, 
        text: themeColors.primaryDark 
      },
      'Advanced': { 
        bg: `${themeColors.primaryDark}10`, 
        border: `${themeColors.primaryDark}25`, 
        text: themeColors.primaryDark 
      },
      'Intermediate': { 
        bg: `${themeColors.primaryDark}10`, 
        border: `${themeColors.primaryDark}25`, 
        text: themeColors.primaryDark 
      },
      'Beginner': { 
        bg: `${themeColors.primaryDark}10`, 
        border: `${themeColors.primaryDark}25`, 
        text: themeColors.primaryDark 
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
      'Advanced': '📈 Advanced',
      'Intermediate': '📊 Intermediate',
      'Beginner': '🌱 Beginner',
    };
    return badges[level] || level;
  };

  // Get level score for dots
  const getLevelScore = (level) => {
    const scores = {
      'Native': 5,
      'Mother Tongue': 5,
      'Fluent': 4,
      'Professional': 4,
      'Advanced': 3,
      'Intermediate': 3,
      'Beginner': 1,
    };
    return scores[level] || 3;
  };

  return (
    <section 
      id="languages" 
      className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-28"
      style={{ backgroundColor: themeColors.sectionBg }}
    >
      <div className="mx-auto max-w-7xl">

        <div className="mx-auto mb-14 max-w-[650px] text-center">
          <p className="text-sm uppercase tracking-[0.28em]" style={{ color: themeColors.primaryDark }}>
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
          {languagesData.map((lang, idx) => {
            const levelColor = getLevelColor(lang.level);
            // Use provided flag or get from default flags
            const flag = lang.flag || defaultFlags[lang.name] || '🌐';
            const levelScore = getLevelScore(lang.level);
            
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
                    {flag}
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
                          const filled = i < levelScore;
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
              backgroundColor: `${themeColors.primaryDark}05`
            }}
          >
            <div>
              <p className="text-3xl font-bold" style={{ color: themeColors.primaryDark }}>
                {languagesData.length}
              </p>
              <p className="text-xs" style={{ color: themeColors.primaryDark }}>
                Total Languages
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: themeColors.primaryDark }}>
                {languagesData.filter(l => l.level === 'Native' || l.level === 'Mother Tongue').length}
              </p>
              <p className="text-xs" style={{ color: themeColors.primaryDark }}>
                Native Languages
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: themeColors.primaryDark }}>
                {languagesData.filter(l => l.level === 'Fluent' || l.level === 'Professional' || l.level === 'Advanced').length}
              </p>
              <p className="text-xs" style={{ color: themeColors.primaryDark }}>
                Fluent Languages
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}