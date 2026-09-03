import { useTheme } from "../context/ThemeContext";

export default function Skills({ skills }) {
  // Safely use theme with fallback
  let themeColors;

  try {
    const theme = useTheme();
    themeColors = theme.themeColors;
  } catch {
    // Fallback theme if not in provider
    themeColors = {
      primary: "#08bde0",
      primaryDark: "#07a8c9",
      primaryLight: "#e8f4f8",
      accent: "#48e39a",
      accentDark: "#32d789",
      text: "#10243e",
      textSecondary: "#7c8997",
      border: "#e9eef2",
      cardBg: "#ffffff",
      cardBorder: "#e7edf1",
      background: "#f8fafb",
      sectionBg: "#ffffff",
      shadow: "rgba(16,36,62,0.08)",
      shadowHover: "rgba(16,36,62,0.12)",
      gradient: "linear-gradient(135deg, #08bde0, #07a8c9)",
    };
  }

  // Use props or fallback data
  const skillsData = skills || {
    frontend: ["HTML", "CSS", "React.js", "Tailwind CSS", "Material Tailwind"],
    backend: ["Node.js", "Express.js", "PHP"],
    database: ["MySQL", "MongoDB"],
    tools: ["Git", "GitHub", "REST API", "Postman"],
    languages: ["JavaScript", "Python", "Java"],
    coreSubjects: ["Data Structures", "Algorithms", "Computer Networks"],
  };

  // Get category color based on theme
  const getCategoryColor = (category) => {
    const colors = {
      languages: themeColors.primaryDark,
      frontend: themeColors.primaryDark,
      backend: themeColors.primaryDark,
      database: themeColors.primaryDark,
      tools: themeColors.primaryDark,
      coreSubjects: themeColors.primaryDark,
    };

    return colors[category] || themeColors.primary;
  };

  // Category icons and labels
  const categoryConfig = {
    languages: {
      icon: "💻",
      label: "Languages",
    },
    frontend: {
      icon: "🎨",
      label: "Frontend",
    },
    backend: {
      icon: "⚙️",
      label: "Backend",
    },
    database: {
      icon: "🗄️",
      label: "Database",
    },
    tools: {
      icon: "🛠️",
      label: "Tools",
    },
    coreSubjects: {
      icon: "📚",
      label: "Core Subjects",
    },
  };

  // Calculate stats
  const totalSkills = Object.values(skillsData).reduce(
    (acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0),
    0
  );
  const totalCategories = Object.keys(skillsData).length;
  const frontendCount = skillsData.frontend?.length || 0;
  const backendCount = skillsData.backend?.length || 0;

  return (
    <section
      id="skills"
      className="relative px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      style={{
        backgroundColor: themeColors.background,
      }}
    >
      <div className="mx-auto max-w-6xl">

        {/* ================= SECTION HEADER ================= */}
        <div className="mx-auto mb-8 max-w-[600px] text-center">
          <p
            className="text-xs uppercase tracking-[0.22em]"
            style={{
              color: themeColors.primary,
            }}
          >
            Tech Stack
          </p>

          <h2
            className="m-0 mt-1 text-2xl font-bold tracking-[-0.8px] sm:text-3xl"
            style={{
              color: themeColors.text,
            }}
          >
            Skills I Use Daily
          </h2>

          <p
            className="mx-auto mt-2 max-w-xl text-xs sm:text-sm"
            style={{
              color: themeColors.textSecondary,
            }}
          >
            These are the languages, frameworks, and tools I leverage to
            build modern applications and portfolios.
          </p>
        </div>

        {/* ================= SKILLS CARDS ================= */}
        <div
          className="
            mx-auto
            grid
            max-w-5xl
            grid-cols-1
            gap-4
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          {Object.entries(skillsData).map(([category, items]) => {
            const config = categoryConfig[category] || {
              icon: "📦",
              label: category,
            };

            const catColor = getCategoryColor(category);

            // Skip if items is not an array or empty
            if (!Array.isArray(items) || items.length === 0) return null;

            return (
              <div
                key={category}
                className="
                  group
                  rounded-xl
                  border
                  p-4
                  transition-all
                  duration-300
                  hover:-translate-y-1
                "
                style={{
                  borderColor: themeColors.border,
                  backgroundColor: themeColors.cardBg,
                  boxShadow: `0 6px 20px ${themeColors.shadow}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 12px 30px ${themeColors.shadowHover}`;
                  e.currentTarget.style.borderColor = catColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 6px 20px ${themeColors.shadow}`;
                  e.currentTarget.style.borderColor = themeColors.border;
                }}
              >
                {/* ================= CATEGORY HEADER ================= */}
                <div className="mb-4 flex items-center gap-2.5">
                  {/* Icon */}
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      text-lg
                      transition-all
                      duration-300
                      group-hover:scale-105
                    "
                    style={{
                      backgroundColor: `${catColor}15`,
                      border: `1px solid ${catColor}30`,
                      color: catColor,
                    }}
                  >
                    {config.icon}
                  </div>

                  {/* Category Name */}
                  <h3
                    className="
                      text-lg
                      font-semibold
                      capitalize
                      transition-colors
                      duration-300
                    "
                    style={{
                      color: themeColors.text,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = catColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = themeColors.text;
                    }}
                  >
                    {config.label}
                  </h3>
                </div>

                {/* ================= SKILL BADGES ================= */}
                <div className="flex flex-wrap gap-1.5">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="
                        inline-flex
                        items-center
                        rounded-full
                        border
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        transition-all
                        duration-200
                        hover:scale-105
                        hover:shadow-sm
                      "
                      style={{
                        borderColor: `${catColor}30`,
                        backgroundColor: `${catColor}10`,
                        color: catColor,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = catColor;
                        e.currentTarget.style.backgroundColor =
                          `${catColor}25`;
                        e.currentTarget.style.boxShadow =
                          `0 3px 8px ${catColor}25`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          `${catColor}30`;
                        e.currentTarget.style.backgroundColor =
                          `${catColor}10`;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= SKILL STATS ================= */}
        <div className="mx-auto mt-7 max-w-4xl">
          <div
            className="
              grid
              grid-cols-2
              gap-3
              rounded-xl
              border
              p-4
              text-center
              md:grid-cols-4
            "
            style={{
              borderColor: themeColors.border,
              backgroundColor: `${themeColors.primary}05`,
            }}
          >
            {/* Total Skills */}
            <div className="transition-all duration-300 hover:scale-105">
              <p
                className="text-xl font-bold"
                style={{
                  color: themeColors.primary,
                }}
              >
                {totalSkills}
              </p>
              <p
                className="mt-0.5 text-[10px]"
                style={{
                  color: themeColors.textSecondary,
                }}
              >
                Total Skills
              </p>
            </div>

            {/* Categories */}
            <div className="transition-all duration-300 hover:scale-105">
              <p
                className="text-xl font-bold"
                style={{
                  color: themeColors.primary,
                }}
              >
                {totalCategories}
              </p>
              <p
                className="mt-0.5 text-[10px]"
                style={{
                  color: themeColors.textSecondary,
                }}
              >
                Categories
              </p>
            </div>

            {/* Frontend Skills */}
            <div className="transition-all duration-300 hover:scale-105">
              <p
                className="text-xl font-bold"
                style={{
                  color: themeColors.primary,
                }}
              >
                {frontendCount}
              </p>
              <p
                className="mt-0.5 text-[10px]"
                style={{
                  color: themeColors.textSecondary,
                }}
              >
                Frontend Skills
              </p>
            </div>

            {/* Backend Skills */}
            <div className="transition-all duration-300 hover:scale-105">
              <p
                className="text-xl font-bold"
                style={{
                  color: themeColors.primary,
                }}
              >
                {backendCount}
              </p>
              <p
                className="mt-0.5 text-[10px]"
                style={{
                  color: themeColors.textSecondary,
                }}
              >
                Backend Skills
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}