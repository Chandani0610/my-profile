import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";
import API from "../services/api";

export default function Skills({ skills: propSkills }) {
  const [skillsData, setSkillsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
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

  // Use primary colors for stats (matching Projects component)
  const STATS_COLOR = themeColors.primary || "#08bde0";
  const STATS_BG = `${themeColors.primary}05`; // Matching Projects component's 05 opacity

  // Category colors for cards (keeping original)
  const CATEGORY_COLOR = themeColors.primary || "#08bde0";
  const CATEGORY_BG = `${themeColors.primary}10`;
  const CATEGORY_BORDER = `${themeColors.primary}30`;

  // Category configuration with icons and labels
  const categoryConfig = {
    languages: { icon: "💻", label: "Languages" },
    frontend: { icon: "🎨", label: "Frontend" },
    backend: { icon: "⚙️", label: "Backend" },
    database: { icon: "🗄️", label: "Database" },
    tools: { icon: "🛠️", label: "Tools" },
    coreSubjects: { icon: "📚", label: "Core Subjects" },
  };

  // Category order for display
  const categoryOrder = ["languages", "frontend", "backend", "database", "tools", "coreSubjects"];

  // Fallback data if no skills are available
  const fallbackSkills = {
    languages: ["C", "C++", "Core Java", "JavaScript", "SQL"],
    frontend: ["HTML", "CSS", "React.js", "Tailwind CSS", "Material Tailwind"],
    backend: ["Node.js", "Express.js", "REST APIs"],
    database: ["MySQL", "Oracle SQL"],
    tools: ["Git", "GitHub", "VS Code", "Postman"],
    coreSubjects: ["Data Structures & Algorithms", "DBMS", "OOP", "Operating Systems", "Computer Networks", "Cloud Computing"],
  };

  // Fetch skills data if not provided as prop
  useEffect(() => {
    const loadSkills = async () => {
      try {
        if (propSkills) {
          const completeSkills = { ...propSkills };
          categoryOrder.forEach(cat => {
            if (!completeSkills[cat]) {
              completeSkills[cat] = [];
            }
          });
          setSkillsData(completeSkills);
          setError(null);
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);
        const response = await API.get("/portfolio");
        
        if (response.data && response.data.success) {
          let skills = response.data.data?.skills || {};
          const completeSkills = { ...skills };
          categoryOrder.forEach(cat => {
            if (!completeSkills[cat]) {
              completeSkills[cat] = [];
            }
          });
          setSkillsData(completeSkills);
        } else {
          setSkillsData(fallbackSkills);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
        setError("Failed to load skills data");
        setSkillsData(fallbackSkills);
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, [propSkills]);

  // Get skills list with safe fallback
  const getSkillsList = () => {
    if (loading) return {};
    
    if (skillsData && Object.keys(skillsData).length > 0) {
      const hasSkills = Object.values(skillsData).some(arr => arr && arr.length > 0);
      if (hasSkills) {
        return skillsData;
      }
    }
    
    return fallbackSkills;
  };

  const finalSkills = getSkillsList();

  // Calculate stats
  const totalSkills = Object.values(finalSkills).reduce(
    (acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0),
    0
  );
  
  const totalCategories = Object.keys(finalSkills).filter(key => 
    Array.isArray(finalSkills[key]) && finalSkills[key].length > 0
  ).length;
  
  const getCategoryCount = (category) => {
    const skills = finalSkills[category] || [];
    return skills.length;
  };

  // Render loading state
  if (loading) {
    return (
      <section 
        id="skills" 
        className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-28"
        style={{ backgroundColor: themeColors.sectionBg }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center py-12">
            <div 
              className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
              style={{
                borderColor: `${themeColors.primary}40`,
                borderTopColor: themeColors.primary,
              }}
            />
            <p className="mt-4" style={{ color: themeColors.textSecondary }}>
              Loading skills data...
            </p>
          </div>
        </div>
      </section>
    );
  }

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
            {error 
              ? "Languages, frameworks, and tools I use to build modern applications." 
              : `${totalSkills} skills across ${totalCategories} categories that I leverage to build modern applications and portfolios.`
            }
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-8 mb-6 rounded-xl border border-red-400/20 bg-red-400/10">
            <p className="text-red-400">{error}</p>
            <p className="text-sm mt-2" style={{ color: themeColors.textSecondary }}>
              Showing fallback skills data.
            </p>
          </div>
        )}

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
          {categoryOrder.map((category) => {
            const items = finalSkills[category] || [];
            const config = categoryConfig[category] || {
              icon: "📦",
              label: category,
            };

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
                  e.currentTarget.style.borderColor = CATEGORY_COLOR;
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
                      backgroundColor: CATEGORY_BG,
                      border: `1px solid ${CATEGORY_BORDER}`,
                      color: CATEGORY_COLOR,
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
                      e.currentTarget.style.color = CATEGORY_COLOR;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = themeColors.text;
                    }}
                  >
                    {config.label}
                  </h3>

                  {/* Skill Count */}
                  <span
                    className="ml-auto text-xs font-medium"
                    style={{ color: themeColors.textSecondary }}
                  >
                    {items.length}
                  </span>
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
                        font-medium
                        transition-all
                        duration-200
                        hover:scale-105
                        hover:shadow-sm
                      "
                      style={{
                        borderColor: CATEGORY_BORDER,
                        backgroundColor: CATEGORY_BG,
                        color: CATEGORY_COLOR,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = CATEGORY_COLOR;
                        e.currentTarget.style.backgroundColor = `${CATEGORY_COLOR}25`;
                        e.currentTarget.style.boxShadow = `0 3px 8px ${CATEGORY_COLOR}25`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = CATEGORY_BORDER;
                        e.currentTarget.style.backgroundColor = CATEGORY_BG;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* ================= CATEGORY PROGRESS BAR ================= */}
                <div className="mt-3">
                  <div
                    className="h-0.5 w-full rounded-full"
                    style={{
                      backgroundColor: `${CATEGORY_COLOR}20`,
                    }}
                  >
                    <div
                      className="h-0.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((items.length / 15) * 100, 100)}%`,
                        backgroundColor: CATEGORY_COLOR,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= SKILL STATS - Using Primary Colors (matching Projects) ================= */}
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
              backgroundColor: STATS_BG, // Now using primary with 05 opacity
            }}
          >
            {/* Total Skills */}
            <div className="transition-all duration-300 hover:scale-105">
              <p
                className="text-2xl font-bold"
                style={{
                  color: STATS_COLOR, // Now using primary color
                }}
              >
                {totalSkills}
              </p>
              <p
                className="mt-0.5 text-[10px] font-medium"
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
                className="text-2xl font-bold"
                style={{
                  color: STATS_COLOR, // Now using primary color
                }}
              >
                {totalCategories}
              </p>
              <p
                className="mt-0.5 text-[10px] font-medium"
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
                className="text-2xl font-bold"
                style={{
                  color: STATS_COLOR, // Now using primary color
                }}
              >
                {getCategoryCount("frontend")}
              </p>
              <p
                className="mt-0.5 text-[10px] font-medium"
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
                className="text-2xl font-bold"
                style={{
                  color: STATS_COLOR, // Now using primary color
                }}
              >
                {getCategoryCount("backend")}
              </p>
              <p
                className="mt-0.5 text-[10px] font-medium"
                style={{
                  color: themeColors.textSecondary,
                }}
              >
                Backend Skills
              </p>
            </div>
          </div>
        </div>

        {/* ================= EMPTY STATE ================= */}
        {Object.values(finalSkills).every(arr => arr.length === 0) && (
          <div className="text-center py-12 mt-6">
            <div className="text-6xl mb-4">🛠️</div>
            <p style={{ color: themeColors.textSecondary }}>
              No skills available. Start adding your skills in the admin panel.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}