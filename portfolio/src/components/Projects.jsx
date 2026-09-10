// components/Projects.jsx
import { ArrowRight, ExternalLink } from "lucide-react";
import { getImageUrl } from "../services/api";
import vedantDevotionsImg from "../assets/vedant-devotions.png";
import kahanilandMobileImg from "../assets/kahaniland-mobile.jpg";

export default function Projects({ projects }) {
  const defaultProjects = [
    {
      id: 1,
      title: "Fee Management System",
      description: "A web application to manage student fees, payments and attendance.",
      tech: ["React.js", "Tailwind CSS", "Node.js", "MySQL"],
      demo: "#",
      github: "https://github.com/Chandani0610",
      image: null,
      type: "fee",
    },
    {
      id: 2,
      title: "Vedant Devotions",
      description: "A devotional website to upload videos, lyrics and photos.",
      tech: ["React.js", "Tailwind CSS", "Node.js", "MySQL"],
      demo: "#",
      github: "https://github.com/Chandani0610",
      image: vedantDevotionsImg,
      type: "vedant",
    },
    {
      id: 3,
      title: "KahaniLand (Mobile App)",
      description: "React Native app for children with stories and videos.",
      tech: ["React Native", "Redux", "Firebase"],
      demo: "#",
      github: "https://github.com/Chandani0610",
      image: kahanilandMobileImg,
      type: "mobile",
    },
  ];

  // Merge projects from props or database with fallbacks
  const rawList = (projects && projects.length > 0) ? projects : defaultProjects;

  const projectList = rawList.map((p, idx) => {
    const title = p.title || "Featured Project";
    const lower = title.toLowerCase();

    let fallbackType = "generic";
    let fallbackImg = null;

    if (lower.includes("vedant")) {
      fallbackType = "vedant";
      fallbackImg = vedantDevotionsImg;
    } else if (lower.includes("mobile") || lower.includes("kahani")) {
      fallbackType = "mobile";
      fallbackImg = kahanilandMobileImg;
    } else if (lower.includes("fee")) {
      fallbackType = "fee";
    }

    const techList = Array.isArray(p.tech)
      ? p.tech
      : (p.tech || p.technologies || "")
          .split("+")
          .join(",")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

    return {
      id: p.id || idx + 1,
      title,
      description: p.description || "",
      tech: techList.length > 0 ? techList : ["React.js", "Tailwind CSS", "MySQL"],
      demo: p.demo || "#",
      github: p.github || "https://github.com/Chandani0610",
      image: p.image || fallbackImg,
      type: p.image ? "custom-image" : fallbackType,
      icon: p.icon || "💻",
    };
  });

  return (
    <section id="other-projects" className="relative w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        
        {/* Section Header */}
        <div className="flex items-end justify-between border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-[11px] font-bold tracking-[0.2em] text-purple-600 uppercase">
              OTHER PROJECTS
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Works
            </h2>
          </div>

          <a
            href="https://github.com/Chandani0610"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-purple-700 hover:text-purple-800 transition"
          >
            <span>View All Projects</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Projects Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projectList.map((project, idx) => (
            <div
              key={project.id || idx}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Thumbnail / UI Mockup Preview */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-transparent flex items-center justify-center">
                {/* 1. Custom Uploaded Image */}
                {project.image ? (
                  <img
                    src={getImageUrl(project.image)}
                    alt={project.title}
                    className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                    onError={(e) => {
                      if (!project.image.startsWith("http") && !project.image.startsWith("/")) {
                        e.target.src = "/" + project.image;
                      }
                    }}
                  />
                ) : project.type === "fee" ? (
                  /* 2. Fee Management System Interactive Mockup */
                  <div className="h-full w-full bg-transparent p-3.5 flex flex-col justify-between transition duration-500 group-hover:scale-105">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                      <span className="text-[10px] font-bold text-slate-700">Fee & Attendance Portal</span>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[8px] font-bold text-emerald-700">Live</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 my-auto">
                      <div className="rounded-xl bg-transparent p-2 border border-slate-200/80 text-center">
                        <div className="text-[9px] text-slate-500 font-medium">Collected</div>
                        <div className="text-xs font-bold text-purple-700">₹8.4L</div>
                      </div>
                      <div className="rounded-xl bg-transparent p-2 border border-slate-200/80 text-center">
                        <div className="text-[9px] text-slate-500 font-medium">Pending</div>
                        <div className="text-xs font-bold text-amber-600">₹1.2L</div>
                      </div>
                      <div className="rounded-xl bg-transparent p-2 border border-slate-200/80 text-center">
                        <div className="text-[9px] text-slate-500 font-medium">Students</div>
                        <div className="text-xs font-bold text-slate-800">420</div>
                      </div>
                    </div>
                    {/* Mini bar chart */}
                    <div className="flex items-end gap-1.5 h-6 px-2">
                      <div className="w-1/6 bg-indigo-400 rounded-t h-3" />
                      <div className="w-1/6 bg-indigo-500 rounded-t h-5" />
                      <div className="w-1/6 bg-indigo-400 rounded-t h-4" />
                      <div className="w-1/6 bg-purple-600 rounded-t h-6" />
                      <div className="w-1/6 bg-indigo-400 rounded-t h-3" />
                      <div className="w-1/6 bg-indigo-500 rounded-t h-5" />
                    </div>
                  </div>
                ) : project.type === "mobile" ? (
                  /* 3. Mobile Device Mockup */
                  <div className="h-full w-full bg-transparent flex items-center justify-center p-2">
                    <div className="h-[95%] w-[120px] overflow-hidden rounded-xl border-2 border-slate-800 shadow-md">
                      <img
                        src={kahanilandMobileImg}
                        alt="KahaniLand Mobile App"
                        className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                ) : (
                  /* 4. Generic Project Banner */
                  <div className="h-full w-full bg-transparent flex flex-col items-center justify-center p-4">
                    <div className="text-3xl mb-1">{project.icon || "💻"}</div>
                    <span className="text-xs font-bold text-slate-700">{project.title}</span>
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h3 className="text-base font-bold text-slate-900">
                  {project.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Tech Badges */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {(Array.isArray(project.tech) ? project.tech : []).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-3">
                {project.type === "mobile" ? (
                  <a
                    href={project.demo || project.github || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-purple-50 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-100"
                  >
                    <span>View Project</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <>
                    <a
                      href={project.demo || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-purple-200 bg-white py-1.5 text-xs font-semibold text-purple-700 transition hover:bg-purple-50"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <a
                      href={project.github || "https://github.com/Chandani0610"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <span>GitHub</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
