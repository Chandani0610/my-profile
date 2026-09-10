// components/Footer.jsx
import { Mail, ArrowUp, FileText, ExternalLink, Sparkles, MapPin } from "lucide-react";

export default function Footer() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "education", label: "Education" },
    { id: "projects", label: "Projects" },
    { id: "certifications", label: "Certifications" },
    { id: "languages", label: "Languages" },
    { id: "hobbies", label: "Hobbies" },
    { id: "contact", label: "Contact" },
  ];

  const socialLinks = [
    {
      name: "Email",
      label: "kumarichandanipali@gmail.com",
      href: "mailto:kumarichandanipali@gmail.com",
      isEmail: true,
      icon: (
        <Mail className="h-4 w-4 text-purple-300" />
      ),
      bgHover: "hover:border-purple-500/50 hover:bg-purple-500/10",
    },
    {
      name: "LinkedIn",
      label: "chandani-kumari",
      href: "https://www.linkedin.com/in/chandani-kumari-781136261/",
      icon: (
        <svg className="h-4 w-4 fill-sky-400" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.74c-.95 0-1.72.77-1.72 1.72s.77 1.72 1.72 1.72 1.72-.77 1.72-1.72-.77-1.72-1.72-1.72Z"/>
        </svg>
      ),
      bgHover: "hover:border-sky-500/50 hover:bg-sky-500/10",
    },
    {
      name: "GitHub",
      label: "Chandani0610",
      href: "https://github.com/Chandani0610",
      icon: (
        <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
          <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/>
        </svg>
      ),
      bgHover: "hover:border-purple-500/50 hover:bg-purple-500/10",
    },
    {
      name: "LeetCode",
      label: "chandani_06",
      href: "https://leetcode.com",
      icon: (
        <svg className="h-4 w-4 fill-amber-400" viewBox="0 0 24 24">
          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.565 5.997 5.997 0 0 0 3.343-.828l6.109-4.288a1.375 1.375 0 0 0-.17-2.317 1.374 1.374 0 0 0-.952-.162l-6.282 4.39a3.25 3.25 0 0 1-1.815.45 3.19 3.19 0 0 1-2.583-1.92 3.11 3.11 0 0 1-.225-.66 2.98 2.98 0 0 1-.035-1.284 2.87 2.87 0 0 1 .655-1.144L9.047 8.35l5.397-5.787a1.375 1.375 0 0 0-.961-2.563zm1.617 10.985a1.375 1.375 0 0 0-.012 2.75h6.912a1.375 1.375 0 0 0 0-2.75z"/>
        </svg>
      ),
      bgHover: "hover:border-amber-500/50 hover:bg-amber-500/10",
    },
    {
      name: "HackerRank",
      label: "chandani_code",
      href: "https://hackerrank.com",
      icon: (
        <svg className="h-4 w-4 fill-emerald-400" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.87 17.5h-2.14v-4.32H10.27v4.32H8.13V6.5h2.14v4.32h3.46V6.5h2.14v11z"/>
        </svg>
      ),
      bgHover: "hover:border-emerald-500/50 hover:bg-emerald-500/10",
    },
  ];

  return (
    <footer id="footer" className="footer-section relative w-full bg-[#120626] text-white pt-16 pb-8 border-t border-purple-900/40 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 pb-12 border-b border-white/10">
          
          {/* Brand & Quote (Col 1-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Brand Header */}
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl ck-monogram-badge bg-gradient-to-br from-purple-500 to-indigo-600 text-base font-bold text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-400/20">
                  CK
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Chandani Kumari</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-medium text-purple-300">Full Stack Developer</span>
                    <span className="h-1 w-1 rounded-full bg-purple-400" />
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Available
                    </span>
                  </div>
                </div>
              </div>

              {/* Quote Card */}
              <div className="mt-5 rounded-2xl border border-purple-500/20 bg-purple-950/40 p-4 backdrop-blur-sm max-w-[380px]">
                <p className="text-xs sm:text-[13px] italic text-purple-200 leading-relaxed">
                  "Turning ideas into interactive, real-world solutions."
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-purple-300/80 font-medium">
                  <MapPin className="h-3 w-3 text-purple-400" />
                  <span>Madhubani, Bihar, India</span>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-4 border-t border-white/5">
              <p className="text-xs text-purple-300/70 font-medium">
                © {new Date().getFullYear()} Chandani Kumari. All Rights Reserved.
              </p>
            </div>
          </div>

          {/* Quick Links (Col 6-8) */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Quick Links
              </h4>
            </div>
            
            <ul className="mt-4 grid grid-cols-2 sm:grid-cols-1 gap-2 text-xs">
              {navLinks.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className="group flex items-center gap-1.5 text-purple-200/75 hover:text-white transition-all py-0.5"
                  >
                    <span className="h-1 w-1 rounded-full bg-purple-500/40 group-hover:bg-purple-400 group-hover:w-2 transition-all duration-200" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {section.label}
                    </span>
                  </button>
                </li>
              ))}
              <li className="pt-1">
                <a
                  href="/Chandani_Kumari_Resume.pdf"
                  download
                  className="group inline-flex items-center gap-1.5 rounded-lg bg-white/5 border border-purple-400/20 px-2.5 py-1 text-xs font-medium text-purple-200 hover:text-white hover:bg-purple-600/30 hover:border-purple-400/50 transition-all"
                >
                  <FileText className="h-3 w-3 text-purple-400" />
                  <span>Resume</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Connect With Me (Col 9-12) */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Connect With Me
            </h4>
            
            <div className="mt-4 flex flex-col gap-2.5">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.isEmail ? undefined : "_blank"}
                  rel={item.isEmail ? undefined : "noreferrer"}
                  className={`group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-xs text-purple-200/80 transition-all duration-200 hover:text-white ${item.bgHover}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-purple-400/40 group-hover:scale-105 transition-all">
                      {item.icon}
                    </div>
                    <div className="truncate">
                      <span className="block font-semibold text-white text-xs leading-none">
                        {item.name}
                      </span>
                      <span className="block text-[11px] text-purple-300/70 truncate mt-0.5">
                        {item.label}
                      </span>
                    </div>
                  </div>

                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-purple-400/50 group-hover:text-white group-hover:translate-x-0.5 transition-all ml-2" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar: Designed With Attention To Detail + Back to Top */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-300/60">
          <p className="flex items-center gap-1.5">
            <span>Designed with thoughtful attention to detail.</span>
          </p>

          <div className="flex items-center gap-4">
            <span>Built with React · Tailwind CSS</span>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-[11px] font-semibold text-purple-200 hover:bg-purple-700 hover:text-white hover:border-purple-600 transition-all duration-200 shadow-xs"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
