// components/FeaturedProject.jsx
import { ArrowRight, ExternalLink, Check, BookOpen } from "lucide-react";
import kahanilandWebImg from "../assets/kahaniland-web.jpg";
import kahanilandMobileImg from "../assets/kahaniland-mobile.jpg";

export default function FeaturedProject({ project }) {
  const defaultProject = {
    title: "KahaniLand",
    tag: "FEATURED PROJECT",
    description:
      "A full-stack storytelling platform for children with videos, stories and interactive learning.",
    tech: ["React.js", "Node.js", "Express.js", "MySQL"],
    demo: "#",
    github: "https://github.com/Chandani0610",
    features: [
      "JWT authentication",
      "Role-based admin dashboard",
      "Story & video management",
      "MySQL-backed REST APIs",
      "User activity & notifications"
    ]
  };

  const data = project || defaultProject;

  return (
    <section id="projects" className="relative w-full px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        
        {/* Main Banner Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] featured-project-card bg-gradient-to-br from-[#4c1d95] via-[#581c87] to-[#3730a3] p-8 text-white shadow-2xl shadow-purple-950/25 sm:p-10 lg:p-12">
          
          {/* Ambient background glows */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">
            
            {/* =========================================
                LEFT COLUMN: PROJECT INFO (Col 1-4)
            ========================================= */}
            <div className="flex flex-col items-start lg:col-span-4">
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-wider text-purple-200 uppercase backdrop-blur-md">
                {data.tag || "FEATURED PROJECT"}
              </span>

              <div className="mt-4 flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-purple-300" />
                <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {data.title}
                </h3>
              </div>

              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-purple-100/80">
                {data.description}
              </p>

              {/* Tech Badges */}
              <div className="mt-5 flex flex-wrap gap-2">
                {data.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Action CTA Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={data.demo || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-purple-900 shadow-md transition hover:bg-purple-50 hover:-translate-y-0.5"
                >
                  <span>Live Demo</span>
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href={data.github || "https://github.com/Chandani0610"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  <span>GitHub</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* =========================================
                CENTER COLUMN: DEVICE MOCKUPS (Col 5-9)
            ========================================= */}
            <div className="relative flex items-center justify-center py-4 lg:col-span-5">
              <div className="relative w-full max-w-[500px]">
                
                {/* Laptop Shell */}
                <div className="relative mx-auto rounded-t-2xl border-4 border-slate-800 bg-slate-900 pt-2 pb-0 shadow-2xl">
                  {/* Web Browser Bar */}
                  <div className="flex items-center gap-1.5 px-3 pb-1.5 border-b border-slate-800">
                    <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />
                    <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                    <div className="mx-auto rounded-full bg-slate-800/90 px-4 py-0.5 text-[9px] text-slate-300 font-mono tracking-wide">
                      https://kahaniland.com
                    </div>
                  </div>

                  {/* Laptop Screen Content: Real KahaniLand Screenshot */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={kahanilandWebImg}
                      alt="KahaniLand Website Preview"
                      className="h-full w-full object-cover object-top transition duration-500 hover:scale-105"
                    />
                  </div>
                </div>

                {/* Laptop Base Stand */}
                <div className="relative mx-auto -mt-0.5 h-3.5 w-[110%] -left-[5%] rounded-b-xl bg-slate-700 shadow-md">
                  <div className="mx-auto h-1 w-14 rounded-full bg-slate-500" />
                </div>

                {/* Mobile Phone Mockup (Front right overlapping) */}
                <div className="absolute -bottom-5 right-[-8px] sm:right-0 z-20 w-[125px] sm:w-[145px] rounded-[1.75rem] border-4 border-slate-900 bg-slate-900 p-1 shadow-2xl drop-shadow-2xl">
                  {/* Phone Speaker & Camera Notch */}
                  <div className="mx-auto h-2 w-10 rounded-full bg-slate-800" />
                  
                  {/* Phone Screen: Real KahaniLand Mobile Screenshot */}
                  <div className="mt-1 aspect-[9/19] overflow-hidden rounded-[1.25rem] bg-slate-900">
                    <img
                      src={kahanilandMobileImg}
                      alt="KahaniLand Mobile App"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* =========================================
                RIGHT COLUMN: KEY FEATURES (Col 10-12)
            ========================================= */}
            <div className="flex flex-col items-start lg:col-span-3">
              <h4 className="text-base font-bold text-white tracking-wide">
                Key Features
              </h4>

              <ul className="mt-4 space-y-3">
                {data.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-purple-100/90 font-medium">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
