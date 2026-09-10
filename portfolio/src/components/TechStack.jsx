// components/TechStack.jsx
import { Layout, Server, Database, Code, Wrench, Sparkles, CheckCircle2 } from "lucide-react";

export default function TechStack({ skills: customSkills }) {
  const techCategories = [
    {
      id: "frontend",
      title: "Frontend Development",
      badge: "User Interface",
      icon: <Layout className="h-5 w-5 text-purple-600" />,
      skills: ["React.js", "Tailwind CSS", "Material Tailwind", "HTML", "CSS", "JavaScript"]
    },
    {
      id: "backend",
      title: "Backend Development",
      badge: "Server & APIs",
      icon: <Server className="h-5 w-5 text-indigo-600" />,
      skills: ["Node.js", "Express.js", "REST APIs", "JWT"]
    },
    {
      id: "database",
      title: "Database Management",
      badge: "Data Storage",
      icon: <Database className="h-5 w-5 text-cyan-600" />,
      skills: ["MySQL", "Oracle SQL"]
    },
    {
      id: "programming",
      title: "Programming & Core",
      badge: "Algorithms",
      icon: <Code className="h-5 w-5 text-emerald-600" />,
      skills: ["C++", "Java", "DSA"]
    },
    {
      id: "tools",
      title: "Tools & Workflow",
      badge: "DevOps & Testing",
      icon: <Wrench className="h-5 w-5 text-amber-600" />,
      skills: ["Git", "GitHub", "VS Code", "Postman", "LeetCode"]
    }
  ];

  return (
    <section id="skills" className="relative w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-700 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              <span>Tech Stack & Capabilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Technologies I work with
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
              Modern frontend frameworks, scalable backends, databases, and developer tooling I use to craft robust web applications.
            </p>
          </div>
        </div>

        {/* 5 Category Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {techCategories.map((cat) => (
            <div
              key={cat.id}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-md hover:shadow-purple-500/10"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 shadow-xs group-hover:scale-105 transition-transform">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {cat.badge}
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-900">
                  {cat.title}
                </h3>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-xl bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200/60 shadow-2xs group-hover:border-purple-200 group-hover:bg-purple-50/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>{cat.skills.length} skills</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500/80" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
