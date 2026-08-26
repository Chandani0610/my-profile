import resumeData from "../data/resumeData";
import { useTheme } from "../context/ThemeContext";

export default function About() {
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

  return (
    <section 
      id="about" 
      className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-28"
      style={{ backgroundColor: themeColors.sectionBg }}
    >
      <div className="mx-auto max-w-7xl">

        <div className="mx-auto mb-14 max-w-[650px] text-center">

          <p className="text-sm uppercase tracking-[0.28em]" style={{ color: themeColors.primary }}>
            About Me
          </p>

          <h2 className="m-0 text-4xl font-bold tracking-[-1.5px]" style={{ color: themeColors.text }}>
            Designing bright, user-first web experiences
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm" style={{ color: themeColors.textSecondary }}>
            From portfolio landing pages to interactive product showcases,
            I create modern and accessible UI layouts that feel premium.
          </p>

        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">

          {/* Who I Am */}
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
            <div className="flex h-full flex-col justify-center">

              <h3 className="mb-4 text-2xl font-semibold transition-colors duration-300 group-hover:text-[var(--primary)]" style={{ color: themeColors.text }}>
                Who I Am
              </h3>

              <p className="text-sm leading-8" style={{ color: themeColors.textSecondary }}>
                {resumeData.about ||
                  "Computer Science Graduate with hands-on experience in React.js, Node.js, Express.js, MySQL, and JavaScript. Seeking Software Developer and Full Stack Developer opportunities."}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {resumeData.skills?.frontend?.map((skill) => (
                  <span
                    key={skill}
                    className="
                      rounded-full
                      border
                      px-3.5
                      py-1.5
                      text-xs
                      font-semibold
                      transition-all
                      duration-200
                      hover:scale-105
                      hover:shadow-md
                    "
                    style={{ 
                      borderColor: `${themeColors.primary}30`,
                      backgroundColor: `${themeColors.primary}10`,
                      color: themeColors.primary,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${themeColors.primary}25`;
                      e.currentTarget.style.borderColor = themeColors.primary;
                      e.currentTarget.style.boxShadow = `0 4px 12px ${themeColors.primary}25`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${themeColors.primary}10`;
                      e.currentTarget.style.borderColor = `${themeColors.primary}30`;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {skill}
                  </span>
                )) || (
                  <>
                    <span className="skill-pill">HTML</span>
                    <span className="skill-pill">CSS</span>
                    <span className="skill-pill">React.js</span>
                    <span className="skill-pill">Tailwind CSS</span>
                    <span className="skill-pill">Material Tailwind</span>
                  </>
                )}
              </div>

              {/* Decorative indicator */}
              <div 
                className="mt-6 h-0.5 w-12 rounded-full transition-all duration-300 group-hover:w-full group-hover:h-1"
                style={{ backgroundColor: `${themeColors.primary}30` }}
              />
            </div>
          </div>

          {/* My Approach */}
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
            <div className="flex h-full flex-col justify-center">

              <h3 className="mb-4 text-2xl font-semibold transition-colors duration-300 group-hover:text-[var(--accent)]" style={{ color: themeColors.text }}>
                My Approach
              </h3>

              <ul className="space-y-3 text-sm" style={{ color: themeColors.textSecondary }}>
                <li className="flex gap-3 leading-relaxed transition-all duration-200 hover:translate-x-1">
                  <span className="transition-transform duration-200 group-hover:scale-125" style={{ color: themeColors.accent }}>✓</span>
                  Fast-loading interfaces with clean transitions
                </li>
                <li className="flex gap-3 leading-relaxed transition-all duration-200 hover:translate-x-1">
                  <span className="transition-transform duration-200 group-hover:scale-125" style={{ color: themeColors.accent }}>✓</span>
                  Responsive layouts designed for mobile and desktop
                </li>
                <li className="flex gap-3 leading-relaxed transition-all duration-200 hover:translate-x-1">
                  <span className="transition-transform duration-200 group-hover:scale-125" style={{ color: themeColors.accent }}>✓</span>
                  Polished visuals with readable, accessible typography
                </li>
                <li className="flex gap-3 leading-relaxed transition-all duration-200 hover:translate-x-1">
                  <span className="transition-transform duration-200 group-hover:scale-125" style={{ color: themeColors.accent }}>✓</span>
                  Reliable code structure and reusable component patterns
                </li>
              </ul>

              {/* Decorative indicator */}
              <div 
                className="mt-6 h-0.5 w-12 rounded-full transition-all duration-300 group-hover:w-full group-hover:h-1"
                style={{ backgroundColor: `${themeColors.accent}30` }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}