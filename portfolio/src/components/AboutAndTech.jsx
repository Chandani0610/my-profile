// components/AboutAndTech.jsx
import { Check, Target, Layout, Server, Database, Code, Wrench, ArrowUpRight } from "lucide-react";

export default function AboutAndTech({ data }) {
  const about =
    data?.about ||
    "I'm a Computer Science graduate from IES College of Technology, Madhubani, Bihar. I enjoy combining thoughtful UI design with practical full-stack development. I'm passionate about building web and mobile applications that are simple, fast and useful.";

  const approachItems = data?.approach || [
    "Clean and maintainable code",
    "Responsive & accessible UI",
    "Reusable components",
    "Continuous learning"
  ];

  const techCategories = [
    {
      id: "frontend",
      title: "Frontend",
      icon: <Layout className="h-4 w-4 text-purple-600" />,
      skills: ["React.js", "Tailwind CSS", "Material Tailwind", "HTML", "CSS", "JavaScript"]
    },
    {
      id: "backend",
      title: "Backend",
      icon: <Server className="h-4 w-4 text-purple-600" />,
      skills: ["Node.js", "Express.js", "REST APIs", "JWT"]
    },
    {
      id: "database",
      title: "Database",
      icon: <Database className="h-4 w-4 text-purple-600" />,
      skills: ["MySQL", "Oracle SQL"]
    },
    {
      id: "programming",
      title: "Programming",
      icon: <Code className="h-4 w-4 text-purple-600" />,
      skills: ["C++", "Java", "DSA"]
    },
    {
      id: "tools",
      title: "Tools & Others",
      icon: <Wrench className="h-4 w-4 text-purple-600" />,
      skills: ["Git", "GitHub", "VS Code", "Postman", "LeetCode"]
    }
  ];

  return (
    <section id="about" className="relative w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Unified 3-column / responsive grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          
          {/* =========================================
              CARD 1: ABOUT ME (Col 1-4)
          ========================================= */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-md lg:col-span-4">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-purple-600 uppercase">
                ABOUT ME
              </span>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl leading-snug">
                Designing digital experiences with purpose
              </h2>
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-600">
                {about}
              </p>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              {/* Spoken Languages Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  <span>🌐</span>
                  <span>English</span>
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Hindi
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Maithili
                </span>
              </div>

              {/* Location */}
              <div className="mt-4">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-800">
                  <span>📍</span>
                  <span>Based in Madhubani, Bihar</span>
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>

          {/* =========================================
              CARD 2: MY APPROACH (Col 5-6 or 1-2 on mobile)
          ========================================= */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-md lg:col-span-3">
            <div>
              {/* Header with target/compass icon */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <Target className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  My Approach
                </h3>
              </div>

              {/* Checklist */}
              <ul className="mt-6 space-y-4">
                {approachItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-700">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="focus-architecture-badge mt-6 rounded-2xl p-3.5 text-center text-white transition-all duration-300 shadow-md cursor-default"
              style={{
                background: 'linear-gradient(135deg, var(--theme-primary, #7c3aed), var(--theme-primary-dark, #6d28d9))',
                boxShadow: '0 4px 14px 0 var(--theme-glow, rgba(124, 58, 237, 0.25))',
              }}
            >
              <p className="text-xs font-bold text-white tracking-wide">
                ⚡ Focus on scalable architecture & clean UX
              </p>
            </div>
          </div>

          {/* =========================================
              CARD 3: TECH STACK (Col 7-12)
          ========================================= */}
          <div id="skills" className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-md lg:col-span-5">
            <div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Tech Stack
                </h3>
                <p className="text-xs text-slate-500">
                  Technologies I work with
                </p>
              </div>

              {/* Grid of Category cards */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {techCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all hover:bg-slate-50 hover:border-purple-200"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow-xs">
                        {cat.icon}
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {cat.title}
                      </span>
                    </div>

                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {cat.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 shadow-xs border border-slate-200/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
