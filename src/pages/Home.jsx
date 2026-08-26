import Header from "../components/Header";
import Footer from "../components/Footer";
import resumeData from "../data/resumeData";
import profileImage from "../assets/photo (2).jpg";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const themeColors = useTheme().themeColors;

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

  const categoryIcon = {
    languages: '💻',
    frontend: '🎨',
    backend: '⚙️',
    database: '🗄️',
    tools: '🛠️',
    coreSubjects: '📚',
  };

  const categoryLabel = {
    languages: 'Languages',
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Database',
    tools: 'Tools',
    coreSubjects: 'Core Subjects',
  };

  return (
    <>
      <Header />

      <main
        className="min-h-screen"
        style={{
          backgroundColor: themeColors.background,
          color: themeColors.text,
        }}
      >
        {/* ==================== HERO ==================== */}
        <section
          id="home"
          className="relative px-4 py-3 sm:px-6 lg:px-8"
          style={{ backgroundColor: themeColors.background }}
        >
          <div
            className="relative mx-auto max-w-[1250px] min-h-[75vh] overflow-hidden"
            style={{
              backgroundColor: themeColors.primary,
              boxShadow: `0 15px 45px ${themeColors.shadow}`,
            }}
          >
            <div className="relative z-10 flex min-h-[75vh] flex-col items-center lg:flex-row">
              <div className="relative z-20 flex w-full items-center px-6 py-6 sm:px-8 lg:w-[52%] lg:px-12 lg:py-8">
                <div className="w-full max-w-[600px]">
                  <div className="mb-2 text-[8px] font-semibold tracking-[2px] text-white/60">
                    WELCOME TO MY PORTFOLIO
                  </div>

                  <h1 className="m-0 max-w-[600px] text-3xl font-bold leading-[1.02] tracking-[-2px] text-white sm:text-4xl lg:text-[44px] xl:text-[56px]">
                    Let's Make{" "}
                    <span className="text-white">
                      {resumeData.name?.split(" ")[0] || "MAHVU"}
                    </span>
                    <br />
                    <span className="text-white">More </span>
                    <span className="font-light text-white">PRODUCTIVE</span>
                  </h1>

                  <p className="mt-4 max-w-[480px] text-xs leading-relaxed text-white/70 sm:text-sm">
                    Drop your requirement we will define it and build the best for you.
                    <br />
                    You can monitor and manage your business with the platform we will provide.
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => scrollToSection("contact")}
                      className="min-w-[100px] rounded-full px-3.5 py-1.5 text-[8px] font-semibold text-white transition-all duration-300 hover:-translate-y-1"
                      style={{
                        backgroundColor: themeColors.accent,
                        borderColor: themeColors.accent,
                        boxShadow: `0 8px 20px ${themeColors.accent}40`,
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = themeColors.accentDark;
                        e.target.style.boxShadow = `0 12px 30px ${themeColors.accent}50`;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = themeColors.accent;
                        e.target.style.boxShadow = `0 8px 20px ${themeColors.accent}40`;
                      }}
                    >
                      CONTACT NOW
                    </button>

                    <button
                      onClick={() => scrollToSection("about")}
                      className="min-w-[100px] rounded-full border-none bg-transparent px-3.5 py-1.5 text-[8px] font-semibold text-white/80 transition-all duration-300 hover:opacity-70 hover:text-white"
                    >
                      LEARN MORE
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative flex w-full items-center justify-center lg:min-h-[400px] lg:w-[48%]">
                <div className="absolute -right-8 top-5 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.5),rgba(255,255,255,0.16)_45%,transparent_70%)] sm:h-[380px] sm:w-[380px] lg:-right-8 lg:top-5" />

                <div className="absolute right-[80px] top-[80px] h-[240px] w-[240px] rounded-full border border-white/22" />

                <div className="relative z-10 mt-4 flex items-center justify-center lg:mt-0">
                  <img
                    src={profileImage}
                    alt={resumeData.name || "Profile"}
                    className="h-[180px] w-[180px] rounded-full object-cover object-center border-4 border-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:h-[220px] sm:w-[220px] lg:h-[280px] lg:w-[280px] xl:h-[320px] xl:w-[320px]"
                  />
                </div>

                <div className="absolute right-4 top-[140px] z-20 w-[110px] rounded-2xl border border-white/25 bg-white/12 p-3 text-white backdrop-blur-[20px]">
                  <h3 className="m-0 mb-1 text-xl font-bold text-white/90">
                    {resumeData.projects?.length || "3"}
                  </h3>
                  <p className="m-0 text-[7px] leading-relaxed text-white/70">
                    Projects Completed
                  </p>
                </div>
              </div>
            </div>

            <div
              className="flex w-full items-center justify-around border-t border-white/12 px-4 py-3"
              style={{ backgroundColor: `${themeColors.primary}40` }}
            >
              <span className="text-[8px] font-semibold text-white/70 opacity-80">✦ REACT</span>
              <span className="text-[8px] font-semibold text-white/70 opacity-80">✦ TAILWIND</span>
              <span className="text-[8px] font-semibold text-white/70 opacity-80">✦ NODE.JS</span>
              <span className="text-[8px] font-semibold text-white/70 opacity-80">✦ EXPRESS</span>
              <span className="text-[8px] font-semibold text-white/70 opacity-80">✦ MYSQL</span>
            </div>
          </div>
        </section>

        {/* ==================== ABOUT ==================== */}
        <section
          id="about"
          className="relative px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
          style={{ backgroundColor: themeColors.sectionBg }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-8 max-w-[650px] text-center">
              <p className="text-xs uppercase tracking-[0.28em]" style={{ color: `${themeColors.primary}CC` }}>
                About Me
              </p>
              <h2 className="m-0 text-2xl font-bold tracking-[-1.5px]" style={{ color: `${themeColors.text}DD` }}>
                Designing bright, user-first web experiences
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm" style={{ color: `${themeColors.textSecondary}BB` }}>
                From portfolio landing pages to interactive product showcases,
                I create modern and accessible UI layouts that feel premium.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
              <div
                className="rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1"
                style={{
                  borderColor: themeColors.border,
                  backgroundColor: themeColors.cardBg,
                  boxShadow: `0 12px 35px ${themeColors.shadow}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 45px ${themeColors.shadowHover}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 12px 35px ${themeColors.shadow}`;
                }}
              >
                <div className="flex h-full flex-col justify-center">
                  <h3 className="mb-2 text-lg font-semibold" style={{ color: `${themeColors.text}DD` }}>
                    Who I Am
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: `${themeColors.textSecondary}BB` }}>
                    {resumeData.about}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {resumeData.skills.frontend?.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-all duration-200 hover:scale-105"
                        style={{
                          borderColor: `${themeColors.primary}33`,
                          backgroundColor: `${themeColors.primary}15`,
                          color: `${themeColors.primary}CC`,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = `${themeColors.primary}25`;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = `${themeColors.primary}15`;
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1"
                style={{
                  borderColor: themeColors.border,
                  backgroundColor: themeColors.cardBg,
                  boxShadow: `0 12px 35px ${themeColors.shadow}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 45px ${themeColors.shadowHover}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 12px 35px ${themeColors.shadow}`;
                }}
              >
                <div className="flex h-full flex-col justify-center">
                  <h3 className="mb-2 text-lg font-semibold" style={{ color: `${themeColors.text}DD` }}>
                    My Approach
                  </h3>
                  <ul className="space-y-1.5 text-sm" style={{ color: `${themeColors.textSecondary}BB` }}>
                    <li className="flex gap-2 leading-relaxed">
                      <span style={{ color: `${themeColors.accent}CC` }}>✓</span>
                      Fast-loading interfaces with clean transitions
                    </li>
                    <li className="flex gap-2 leading-relaxed">
                      <span style={{ color: `${themeColors.accent}CC` }}>✓</span>
                      Responsive layouts designed for mobile and desktop
                    </li>
                    <li className="flex gap-2 leading-relaxed">
                      <span style={{ color: `${themeColors.accent}CC` }}>✓</span>
                      Polished visuals with readable, accessible typography
                    </li>
                    <li className="flex gap-2 leading-relaxed">
                      <span style={{ color: `${themeColors.accent}CC` }}>✓</span>
                      Reliable code structure and reusable component patterns
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SKILLS ==================== */}
        <section
          id="skills"
          className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
          style={{ backgroundColor: themeColors.background }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.28em]" style={{ color: `${themeColors.primary}CC` }}>
                Tech Stack
              </p>
              <h2 className="text-2xl font-bold" style={{ color: `${themeColors.text}DD` }}>
                Skills I Use Daily
              </h2>
              <p className="mx-auto mt-1.5 max-w-2xl text-sm" style={{ color: `${themeColors.textSecondary}BB` }}>
                Languages, frameworks, and tools I leverage to build modern applications.
              </p>
            </div>

            <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(resumeData.skills).map(([category, items]) => {
                const catColor = getCategoryColor(category);
                return (
                  <div
                    key={category}
                    className="group rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-2"
                    style={{
                      borderColor: themeColors.border,
                      backgroundColor: themeColors.cardBg,
                      boxShadow: `0 8px 25px ${themeColors.shadow}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = catColor;
                      e.currentTarget.style.boxShadow = `0 18px 35px ${themeColors.shadowHover}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = themeColors.border;
                      e.currentTarget.style.boxShadow = `0 8px 25px ${themeColors.shadow}`;
                    }}
                  >
                    <div
                      className="mb-2.5 flex h-[34px] w-[34px] items-center justify-center rounded-xl text-base transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${catColor}20`,
                        color: catColor,
                      }}
                    >
                      {categoryIcon[category] || '📦'}
                    </div>

                    <h3
                      className="mb-2 text-sm font-semibold capitalize transition-all duration-300 group-hover:translate-x-1"
                      style={{ color: `${themeColors.text}DD` }}
                    >
                      {categoryLabel[category] || category}
                    </h3>

                    <div className="flex flex-wrap gap-1">
                      {items.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border px-2 py-0.5 text-[9px] font-semibold transition-all duration-200 hover:scale-105 hover:shadow-md"
                          style={{
                            borderColor: `${catColor}30`,
                            backgroundColor: `${catColor}10`,
                            color: `${catColor}CC`,
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = `${catColor}25`;
                            e.target.style.borderColor = catColor;
                            e.target.style.boxShadow = `0 4px 12px ${catColor}25`;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = `${catColor}10`;
                            e.target.style.borderColor = `${catColor}30`;
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div
                      className="mt-3 h-0.5 w-full rounded-full transition-all duration-300 group-hover:h-1"
                      style={{ backgroundColor: `${catColor}30` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== EDUCATION ==================== */}
        <section
          id="education"
          className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
          style={{ backgroundColor: themeColors.sectionBg }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.28em]" style={{ color: `${themeColors.primary}CC` }}>
                Education
              </p>
              <h2 className="text-2xl font-bold" style={{ color: `${themeColors.text}DD` }}>
                Background & Certifications
              </h2>
              <p className="mx-auto mt-1.5 max-w-2xl text-sm" style={{ color: `${themeColors.textSecondary}BB` }}>
                Strong academic foundation with certifications supporting technical growth.
              </p>
            </div>

            <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resumeData.education.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    borderColor: themeColors.border,
                    backgroundColor: themeColors.cardBg,
                    boxShadow: `0 8px 25px ${themeColors.shadow}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 20px 45px ${themeColors.shadowHover}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 8px 25px ${themeColors.shadow}`;
                  }}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span style={{ color: `${themeColors.primary}CC` }}>🎓</span>
                    <h3 className="text-lg font-semibold" style={{ color: `${themeColors.text}DD` }}>
                      {item.degree}
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: `${themeColors.textSecondary}BB` }}>
                    {item.college}
                  </p>
                  <p className="mt-1.5 text-xs font-semibold" style={{ color: `${themeColors.primary}CC` }}>
                    {item.marks}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: `${themeColors.textSecondary}BB` }}>
                    {item.year}
                  </p>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-6 grid max-w-[1000px] grid-cols-1 gap-4 md:grid-cols-2">
              <div
                className="rounded-2xl border p-5 transition-all duration-300"
                style={{
                  borderColor: themeColors.border,
                  backgroundColor: themeColors.cardBg,
                  boxShadow: `0 8px 25px ${themeColors.shadow}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 45px ${themeColors.shadowHover}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 8px 25px ${themeColors.shadow}`;
                }}
              >
                <h3 className="text-lg font-semibold" style={{ color: `${themeColors.text}DD` }}>
                  🏅 Certifications
                </h3>
                <div className="mt-2.5 space-y-1.5 text-sm" style={{ color: `${themeColors.textSecondary}BB` }}>
                  {resumeData.certifications.map((cert, idx) => (
                    <p key={idx}>
                      <span className="mr-2" style={{ color: `${themeColors.accent}CC` }}>✔</span>
                      {cert}
                    </p>
                  ))}
                </div>
              </div>

              <div
                className="rounded-2xl border p-5 transition-all duration-300"
                style={{
                  borderColor: themeColors.border,
                  backgroundColor: themeColors.cardBg,
                  boxShadow: `0 8px 25px ${themeColors.shadow}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 45px ${themeColors.shadowHover}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 8px 25px ${themeColors.shadow}`;
                }}
              >
                <h3 className="text-lg font-semibold" style={{ color: `${themeColors.text}DD` }}>
                  🌐 Languages
                </h3>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {resumeData.languages.map((lang) => (
                    <span
                      key={lang.name}
                      className="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-all duration-200 hover:scale-105"
                      style={{
                        borderColor: `${themeColors.primary}33`,
                        backgroundColor: `${themeColors.primary}15`,
                        color: `${themeColors.primary}CC`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = themeColors.primary;
                        e.currentTarget.style.backgroundColor = `${themeColors.primary}25`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${themeColors.primary}33`;
                        e.currentTarget.style.backgroundColor = `${themeColors.primary}15`;
                      }}
                    >
                      {lang.flag} {lang.name} ({lang.level})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== PROJECTS ==================== */}
        <section
          id="projects"
          className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
          style={{ backgroundColor: themeColors.background }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.28em]" style={{ color: `${themeColors.primary}CC` }}>
                Projects
              </p>
              <h2 className="text-2xl font-bold" style={{ color: `${themeColors.text}DD` }}>
                Selected Work
              </h2>
              <p className="mx-auto mt-1.5 max-w-2xl text-sm" style={{ color: `${themeColors.textSecondary}BB` }}>
                Featured projects showcasing modern UI and polished detail.
              </p>
            </div>

            <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-5 md:grid-cols-2">
              {resumeData.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="group overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-2"
                  style={{
                    borderColor: themeColors.border,
                    backgroundColor: themeColors.cardBg,
                    boxShadow: `0 10px 30px ${themeColors.shadow}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 25px 50px ${themeColors.shadowHover}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 10px 30px ${themeColors.shadow}`;
                  }}
                >
                  <div className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold" style={{ color: `${themeColors.text}DD` }}>
                        <span style={{ color: `${themeColors.primary}CC` }}>{project.icon}</span> {project.title}
                      </h3>
                      <span
                        className="inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-all duration-300 group-hover:scale-105"
                        style={{
                          borderColor: `${themeColors.primary}30`,
                          backgroundColor: `${themeColors.primary}15`,
                          color: `${themeColors.primary}CC`,
                        }}
                      >
                        Featured
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs" style={{ color: `${themeColors.textSecondary}BB` }}>
                      {project.tech}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed" style={{ color: `${themeColors.textSecondary}BB` }}>
                      {project.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        className="rounded-full px-3.5 py-1 text-[8px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                        style={{
                          backgroundColor: themeColors.primary,
                          boxShadow: `0 4px 15px ${themeColors.primary}30`,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = themeColors.primaryDark;
                          e.target.style.boxShadow = `0 8px 25px ${themeColors.primary}40`;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = themeColors.primary;
                          e.target.style.boxShadow = `0 4px 15px ${themeColors.primary}30`;
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
                        className="rounded-full border px-3.5 py-1 text-[8px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                        style={{
                          borderColor: themeColors.border,
                          backgroundColor: themeColors.cardBg,
                          color: `${themeColors.text}CC`,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = themeColors.primary;
                          e.target.style.color = themeColors.primary;
                          e.target.style.boxShadow = `0 4px 15px ${themeColors.primary}20`;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = themeColors.border;
                          e.target.style.color = `${themeColors.text}CC`;
                          e.target.style.boxShadow = 'none';
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

                    <div
                      className="mt-3 h-0.5 w-8 rounded-full transition-all duration-300 group-hover:w-16"
                      style={{ backgroundColor: `${themeColors.primary}30` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== CONTACT ==================== */}
        <section
          id="contact"
          className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
          style={{ backgroundColor: themeColors.primary }}
        >
          <div
            className="absolute -right-36 -top-36 h-[450px] w-[450px] rounded-full"
            style={{ backgroundColor: `${themeColors.primaryLight}40` }}
          />

          <div className="relative z-10 mx-auto max-w-[900px] text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-white/70">Contact</p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Let's Work Together</h2>
            <p className="mx-auto mt-2 max-w-[550px] text-sm leading-relaxed text-white/70">
              Reach out for collaborations, freelance work, or to discuss your next project idea.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a
                href={`mailto:${resumeData.contact.email}`}
                className="inline-block rounded-full px-5 py-2 text-[10px] font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  backgroundColor: themeColors.accent,
                  boxShadow: `0 4px 15px ${themeColors.accent}30`,
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = themeColors.accentDark;
                  e.target.style.boxShadow = `0 8px 25px ${themeColors.accent}40`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = themeColors.accent;
                  e.target.style.boxShadow = `0 4px 15px ${themeColors.accent}30`;
                }}
              >
                📧 {resumeData.contact.email}
              </a>

              <a
                href={resumeData.contact.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-full border border-white/40 px-5 py-2 text-[10px] font-semibold text-white/80 backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:text-white"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              >
                💼 LinkedIn
              </a>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-5 text-sm text-white/70">
              <span>📍 {resumeData.contact.location}</span>
              <span>📞 {resumeData.contact.phone}</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}