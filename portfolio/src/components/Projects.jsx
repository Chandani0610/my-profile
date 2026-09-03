import { useTheme } from "../context/ThemeContext";

export default function Projects({ projects }) {
  let themeColors;
  try {
    const theme = useTheme();
    themeColors = theme.themeColors;
  } catch {
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
  const projectsData = projects || [
    {
      title: "E-Commerce Platform",
      icon: "🛒",
      tech: "React.js + Node.js + MySQL",
      description: "Full-stack e-commerce platform with payment integration.",
      github: "https://github.com/example/ecommerce",
      demo: "https://ecommerce-demo.com",
    },
    {
      title: "Portfolio Website",
      icon: "💼",
      tech: "React.js + Tailwind CSS",
      description: "Personal portfolio website with admin panel.",
      github: "https://github.com/example/portfolio",
      demo: "https://portfolio-demo.com",
    },
    {
      title: "Task Management App",
      icon: "📋",
      tech: "React.js + Firebase",
      description: "Real-time task management application with team collaboration.",
      github: "https://github.com/example/task-app",
      demo: "#",
    },
  ];

  // Calculate stats
  const totalProjects = projectsData.length;
  const openSourceCount = projectsData.filter(p => p.github && p.github !== '#').length;
  const liveDemoCount = projectsData.filter(p => p.demo && p.demo !== '#').length;

  return (
    <section 
      id="projects" 
      className="relative px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      style={{ backgroundColor: themeColors.background }}
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-[650px] text-center">
          <p className="text-xs uppercase tracking-[0.28em]" style={{ color: themeColors.primary }}>
            Projects
          </p>
          <h2 className="m-0 text-3xl font-bold tracking-[-1px]" style={{ color: themeColors.text }}>
            Selected Work
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm" style={{ color: themeColors.textSecondary }}>
            Featured projects showcasing modern UI, thoughtful layout, and polished detail.
          </p>
        </div>

        {/* Project Cards */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
          {projectsData.map((project, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1"
              style={{ 
                borderColor: themeColors.border,
                backgroundColor: themeColors.cardBg,
                boxShadow: `0 8px 25px ${themeColors.shadow}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 15px 35px ${themeColors.shadowHover}`;
                e.currentTarget.style.borderColor = themeColors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 25px ${themeColors.shadow}`;
                e.currentTarget.style.borderColor = themeColors.border;
              }}
            >
              {/* Project Header */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{ color: themeColors.primary }}
                    >
                      {project.icon || '📁'}
                    </span>
                    <h3 className="text-xl font-semibold" style={{ color: themeColors.text }}>
                      {project.title}
                    </h3>
                  </div>
                  <span
                    className="shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-all duration-300 group-hover:scale-105"
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
                <div className="mt-3 flex flex-wrap gap-1">
                  {project.tech && project.tech.split(' + ').map((tech, i) => (
                    <span
                      key={i}
                      className="rounded-full border px-2 py-0.5 text-[9px] font-semibold transition-all duration-200 hover:scale-105"
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
                <p className="mt-2 text-sm leading-relaxed" style={{ color: themeColors.textSecondary }}>
                  {project.description}
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                {project.github && project.github !== '#' && (
                  <button
                    type="button"
                    className="min-w-[110px] rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    style={{ 
                      borderColor: themeColors.border,
                      backgroundColor: themeColors.cardBg,
                      color: themeColors.text,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = themeColors.primary;
                      e.currentTarget.style.color = themeColors.primary;
                      e.currentTarget.style.backgroundColor = `${themeColors.primary}08`;
                      e.currentTarget.style.boxShadow = `0 4px 12px ${themeColors.primary}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = themeColors.border;
                      e.currentTarget.style.color = themeColors.text;
                      e.currentTarget.style.backgroundColor = themeColors.cardBg;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={() => window.open(project.github, "_blank")}
                  >
                    GitHub ↗
                  </button>
                )}

                {project.demo && project.demo !== '#' && (
                  <button
                    type="button"
                    className="min-w-[110px] rounded-full px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    style={{ 
                      backgroundColor: themeColors.primary,
                      boxShadow: `0 4px 12px ${themeColors.primary}30`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = themeColors.primaryDark;
                      e.currentTarget.style.boxShadow = `0 6px 20px ${themeColors.primary}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = themeColors.primary;
                      e.currentTarget.style.boxShadow = `0 4px 12px ${themeColors.primary}30`;
                    }}
                    onClick={() => window.open(project.demo, "_blank")}
                  >
                    Live Demo ↗
                  </button>
                )}
              </div>

              {/* Decorative line */}
              <div 
                className="mt-3 h-0.5 w-10 rounded-full transition-all duration-300 group-hover:w-20"
                style={{ 
                  backgroundColor: `${themeColors.primary}30`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Project Stats */}
        <div className="mx-auto mt-10 max-w-2xl">
          <div 
            className="grid grid-cols-3 gap-3 rounded-2xl border p-5 text-center"
            style={{ 
              borderColor: themeColors.border,
              backgroundColor: `${themeColors.primary}05`
            }}
          >
            <div>
              <p className="text-2xl font-bold" style={{ color: themeColors.primary }}>
                {totalProjects}
              </p>
              <p className="text-[10px]" style={{ color: themeColors.textSecondary }}>
                Total Projects
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: themeColors.primary }}>
                {openSourceCount}
              </p>
              <p className="text-[10px]" style={{ color: themeColors.textSecondary }}>
                Open Source
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: themeColors.primary }}>
                {liveDemoCount}
              </p>
              <p className="text-[10px]" style={{ color: themeColors.textSecondary }}>
                Live Demos
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}