import resumeData from "../data/resumeData";
import { useTheme } from "../context/ThemeContext";

export default function Projects() {
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
      id="projects" 
      className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-28"
      style={{ backgroundColor: themeColors.background }}
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-[650px] text-center">

          <p className="text-sm uppercase tracking-[0.28em]" style={{ color: themeColors.primary }}>
            Projects
          </p>

          <h2 className="m-0 text-4xl font-bold tracking-[-1.5px]" style={{ color: themeColors.text }}>
            Selected Work
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm" style={{ color: themeColors.textSecondary }}>
            Featured projects showcasing modern UI, thoughtful layout, and
            polished detail.
          </p>

        </div>

        {/* Project Cards */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">

          {resumeData.projects.map((project, idx) => (
            <div
              key={idx}
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
                e.currentTarget.style.borderColor = themeColors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 12px 35px ${themeColors.shadow}`;
                e.currentTarget.style.borderColor = themeColors.border;
              }}
            >
              {/* Project Header */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span 
                      className="text-3xl transition-transform duration-300 group-hover:scale-110"
                      style={{ color: themeColors.primary }}
                    >
                      {project.icon}
                    </span>

                    <h3 className="text-2xl font-semibold" style={{ color: themeColors.text }}>
                      {project.title}
                    </h3>
                  </div>

                  <span
                    className="
                      shrink-0
                      rounded-full
                      border
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      transition-all
                      duration-300
                      group-hover:scale-105
                    "
                    style={{ 
                      borderColor: `${themeColors.primary}30`,
                      backgroundColor: `${themeColors.primary}15`,
                      color: themeColors.primary
                    }}
                  >
                    Featured
                  </span>
                </div>

                {/* Technologies */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tech.split(' + ').map((tech, i) => (
                    <span
                      key={i}
                      className="
                        rounded-full
                        border
                        px-2.5
                        py-1
                        text-[10px]
                        font-semibold
                        transition-all
                        duration-200
                        hover:scale-105
                      "
                      style={{ 
                        borderColor: `${themeColors.primary}30`,
                        backgroundColor: `${themeColors.primary}10`,
                        color: themeColors.primary,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${themeColors.primary}25`;
                        e.currentTarget.style.borderColor = themeColors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `${themeColors.primary}10`;
                        e.currentTarget.style.borderColor = `${themeColors.primary}30`;
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed" style={{ color: themeColors.textSecondary }}>
                  {project.description}
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="
                    min-w-[130px]
                    rounded-full
                    border
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                  style={{ 
                    borderColor: themeColors.border,
                    backgroundColor: themeColors.cardBg,
                    color: themeColors.text,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = themeColors.primary;
                    e.currentTarget.style.color = themeColors.primary;
                    e.currentTarget.style.backgroundColor = `${themeColors.primary}08`;
                    e.currentTarget.style.boxShadow = `0 4px 15px ${themeColors.primary}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = themeColors.border;
                    e.currentTarget.style.color = themeColors.text;
                    e.currentTarget.style.backgroundColor = themeColors.cardBg;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() =>
                    project.github !== "#"
                      ? window.open(project.github, "_blank")
                      : alert("GitHub link coming soon")
                  }
                >
                  GitHub ↗
                </button>

                <button
                  type="button"
                  className="
                    min-w-[130px]
                    rounded-full
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                  style={{ 
                    backgroundColor: themeColors.primary,
                    boxShadow: `0 4px 15px ${themeColors.primary}30`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = themeColors.primaryDark;
                    e.currentTarget.style.boxShadow = `0 8px 25px ${themeColors.primary}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = themeColors.primary;
                    e.currentTarget.style.boxShadow = `0 4px 15px ${themeColors.primary}30`;
                  }}
                  onClick={() =>
                    project.demo !== "#"
                      ? window.open(project.demo, "_blank")
                      : alert("Live demo coming soon")
                  }
                >
                  Live Demo ↗
                </button>
              </div>

              {/* Decorative line at bottom */}
              <div 
                className="mt-4 h-0.5 w-12 rounded-full transition-all duration-300 group-hover:w-24"
                style={{ 
                  backgroundColor: `${themeColors.primary}30`,
                }}
              />
            </div>
          ))}

        </div>

        {/* Project Stats */}
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
                {resumeData.projects.length}
              </p>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                Total Projects
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                {resumeData.projects.filter(p => p.github !== '#').length}
              </p>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                Open Source
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                {resumeData.projects.filter(p => p.demo !== '#').length}
              </p>
              <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                Live Demos
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}