import resumeData from "../data/resumeData";
import { useTheme } from "../context/ThemeContext";

export default function Skills() {
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

  // Get category color based on theme
  const getCategoryColor = (category) => {
    const colors = {
      languages: themeColors.primary,
      frontend: themeColors.accent,
      backend: themeColors.primaryDark,
      database: themeColors.accentDark,
      tools: themeColors.text,
      coreSubjects: themeColors.primary,
    };
    return colors[category] || themeColors.primary;
  };

  // Category icons and labels
  const categoryConfig = {
    languages: { 
      icon: '💻', 
      label: 'Languages',
    },
    frontend: { 
      icon: '🎨', 
      label: 'Frontend',
    },
    backend: { 
      icon: '⚙️', 
      label: 'Backend',
    },
    database: { 
      icon: '🗄️', 
      label: 'Database',
    },
    tools: { 
      icon: '🛠️', 
      label: 'Tools',
    },
    coreSubjects: { 
      icon: '📚', 
      label: 'Core Subjects',
    }
  };

  return (
    <section 
      id="skills" 
      className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-28"
      style={{ backgroundColor: themeColors.background }}
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-[650px] text-center">

          <p className="text-sm uppercase tracking-[0.28em]" style={{ color: themeColors.primary }}>
            Tech Stack
          </p>

          <h2 className="m-0 text-4xl font-bold tracking-[-1.5px]" style={{ color: themeColors.text }}>
            Skills I Use Daily
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm" style={{ color: themeColors.textSecondary }}>
            These are the languages, frameworks, and tools I leverage to build
            modern applications and portfolios.
          </p>

        </div>

        {/* Skills Cards */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

          {Object.entries(resumeData.skills).map(([category, items]) => {
            const config = categoryConfig[category] || { 
              icon: '📦', 
              label: category,
            };
            const catColor = getCategoryColor(category);
            
            return (
              <div
                key={category}
                className="
                  group
                  rounded-2xl
                  border
                  p-7
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
                  e.currentTarget.style.borderColor = catColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 12px 35px ${themeColors.shadow}`;
                  e.currentTarget.style.borderColor = themeColors.border;
                }}
              >
                {/* Category */}
                <div className="mb-6 flex items-center gap-3">
                  <div 
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl transition-all duration-300 group-hover:scale-110"
                    style={{ 
                      backgroundColor: `${catColor}15`,
                      border: `1px solid ${catColor}30`,
                      color: catColor
                    }}
                  >
                    {config.icon}
                  </div>

                  <h3 
                    className="text-2xl font-semibold capitalize transition-colors duration-300"
                    style={{ color: themeColors.text }}
                    onMouseEnter={(e) => e.target.style.color = catColor}
                    onMouseLeave={(e) => e.target.style.color = themeColors.text}
                  >
                    {config.label}
                  </h3>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="
                        inline-flex
                        items-center
                        rounded-full
                        border
                        px-3.5
                        py-1.5
                        text-sm
                        font-semibold
                        transition-all
                        duration-200
                        hover:scale-105
                        hover:shadow-md
                      "
                      style={{ 
                        borderColor: `${catColor}30`,
                        backgroundColor: `${catColor}10`,
                        color: catColor,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = catColor;
                        e.currentTarget.style.backgroundColor = `${catColor}25`;
                        e.currentTarget.style.boxShadow = `0 4px 12px ${catColor}25`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${catColor}30`;
                        e.currentTarget.style.backgroundColor = `${catColor}10`;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Skill count with category color */}
                <div className="mt-4 flex items-center gap-2">
                  <span 
                    className="text-xs"
                    style={{ color: themeColors.textSecondary }}
                  >
                    {items.length} skills
                  </span>
                  <div 
                    className="h-0.5 flex-1 rounded-full transition-all duration-300 group-hover:h-1"
                    style={{ backgroundColor: `${catColor}30` }}
                  />
                </div>

                {/* Category color indicator bar */}
                <div 
                  className="mt-3 h-0.5 w-full rounded-full transition-all duration-300 group-hover:h-1"
                  style={{ backgroundColor: `${catColor}20` }}
                />
              </div>
            );
          })}

        </div>

        {/* Skill Stats */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div 
            className="grid grid-cols-2 gap-4 rounded-2xl border p-8 text-center md:grid-cols-4"
            style={{ 
              borderColor: themeColors.border,
              backgroundColor: `${themeColors.primary}05`
            }}
          >
            <div>
              <p className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                {Object.values(resumeData.skills).reduce((acc, curr) => acc + curr.length, 0)}
              </p>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                Total Skills
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                {Object.keys(resumeData.skills).length}
              </p>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                Categories
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                {resumeData.skills.frontend?.length || 0}
              </p>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                Frontend Skills
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                {resumeData.skills.backend?.length || 0}
              </p>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                Backend Skills
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}