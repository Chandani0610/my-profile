import resumeData from "../data/resumeData";
import { useTheme } from "../context/ThemeContext";

export default function Hobbies() {
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

  const hobbyIcons = ["🎨", "🎧", "🧩", "📚", "🎮", "🎵", "✈️", "📷", "🏃", "🧘"];

  // Hobby color variants using theme colors
  const getHobbyColor = (idx) => {
    const colors = [
      { bg: `${themeColors.primary}15`, border: `${themeColors.primary}30`, text: themeColors.primary },
      { bg: `${themeColors.accent}15`, border: `${themeColors.accent}30`, text: themeColors.accent },
      { bg: `${themeColors.primary}10`, border: `${themeColors.primary}25`, text: themeColors.primaryDark },
      { bg: `${themeColors.accent}10`, border: `${themeColors.accent}25`, text: themeColors.accentDark },
      { bg: `${themeColors.primary}20`, border: `${themeColors.primary}35`, text: themeColors.primary },
      { bg: `${themeColors.accent}20`, border: `${themeColors.accent}35`, text: themeColors.accent },
    ];
    return colors[idx % colors.length];
  };

  return (
    <section 
      id="hobbies" 
      className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-28"
      style={{ backgroundColor: themeColors.background }}
    >
      <div className="mx-auto max-w-7xl">

        <div className="mx-auto mb-14 max-w-[650px] text-center">

          <p className="text-sm uppercase tracking-[0.28em]" style={{ color: themeColors.primary }}>
            Hobbies
          </p>

          <h2 className="m-0 text-4xl font-bold tracking-[-1.5px]" style={{ color: themeColors.text }}>
            Things I Enjoy
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm" style={{ color: themeColors.textSecondary }}>
            A few activities I enjoy in my free time that keep me inspired and balanced.
          </p>

        </div>

        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-5">

          {resumeData.hobbies.map((hobby, idx) => {
            const color = getHobbyColor(idx);
            return (
              <div
                key={idx}
                className="
                  group
                  min-w-[180px]
                  rounded-2xl
                  border
                  px-6
                  py-5
                  text-center
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
                  e.currentTarget.style.borderColor = color.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 8px 25px ${themeColors.shadow}`;
                  e.currentTarget.style.borderColor = themeColors.border;
                }}
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  
                  {/* Icon with background */}
                  <div 
                    className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                    style={{ 
                      backgroundColor: color.bg,
                      border: `1px solid ${color.border}`,
                      color: color.text
                    }}
                  >
                    {hobbyIcons[idx % hobbyIcons.length]}
                  </div>

                  <span 
                    className="font-semibold transition-colors duration-300"
                    style={{ color: themeColors.text }}
                    onMouseEnter={(e) => e.target.style.color = color.text}
                    onMouseLeave={(e) => e.target.style.color = themeColors.text}
                  >
                    {hobby}
                  </span>

                  {/* Decorative dot that expands on hover */}
                  <div 
                    className="h-1.5 w-1.5 rounded-full transition-all duration-300 group-hover:w-8 group-hover:h-2"
                    style={{ backgroundColor: color.text }}
                  />
                </div>
              </div>
            );
          })}

        </div>

        {/* Quote or Inspiration */}
        <div className="mx-auto mt-12 max-w-2xl text-center">
          <blockquote 
            className="rounded-2xl border-l-4 p-6 text-sm italic transition-all duration-300 hover:shadow-md"
            style={{ 
              borderColor: themeColors.primary,
              backgroundColor: `${themeColors.primary}08`,
              color: themeColors.textSecondary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 8px 25px ${themeColors.shadow}`;
              e.currentTarget.style.backgroundColor = `${themeColors.primary}12`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.backgroundColor = `${themeColors.primary}08`;
            }}
          >
            "The secret of getting ahead is getting started. 
            Find joy in the journey, not just the destination."
          </blockquote>
        </div>

      </div>
    </section>
  );
}