// components/Hero.jsx
import { ArrowRight, Download, Briefcase, Code2, MapPin } from "lucide-react";
import profileImage from "../assets/photo.png";

export default function Hero({ data, scrollToSection }) {
  const name = data?.name || "Chandani Kumari";
  const firstName = name.split(" ")[0] || "Chandani";
  const role = data?.role || "Full Stack Developer";
  const heroDescription =
    data?.heroDescription ||
    "I build modern, responsive and scalable web applications using React, Node.js, Express and MySQL. Passionate about solving real problems with clean code and great UI.";

  return (
    <section id="home" className="relative w-full px-3 py-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2.5rem] hero-banner bg-gradient-to-br from-[#6b21a8] via-[#7e22ce] to-[#4c1d95] shadow-2xl shadow-purple-950/30">
        
        {/* Subtle decorative background glows and curves */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-96 rounded-full bg-purple-400/15 blur-2xl" />

        {/* Hero Grid Container */}
        <div className="relative z-10 grid min-h-[580px] grid-cols-1 items-center gap-8 px-6 pt-10 pb-6 sm:px-10 lg:grid-cols-12 lg:gap-4 lg:px-12 lg:pt-14 lg:pb-0">
          
          {/* =========================================
              LEFT COLUMN (Col 1-5)
          ========================================= */}
          <div className="flex flex-col items-start justify-center lg:col-span-5">
            {/* Pill: Available for Opportunities */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-purple-100 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
              </span>
              <span>Available for Opportunities</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[44px] xl:text-[50px] leading-[1.1]">
              Hi, I'm {firstName} 👋
              <br />
              <span className="text-white drop-shadow-sm">{role}</span>
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-[500px] text-sm leading-relaxed text-purple-100/80 sm:text-[15px]">
              {heroDescription}
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollToSection("projects")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-purple-900 shadow-lg shadow-purple-950/20 transition-all duration-200 hover:bg-purple-50 hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>View Projects</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href="/Chandani_Kumari_Resume.pdf"
                download
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:border-white/50"
              >
                <Download className="h-4 w-4" />
                <span>Download Resume</span>
              </a>
            </div>

            {/* Floating Tech Badges Row */}
            <div className="mt-8 flex flex-wrap items-center gap-2 pb-4 lg:pb-8">
              {/* React */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
                <span className="text-[#00d8ff]">⚛</span>
                <span>React</span>
              </div>

              {/* Node.js */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
                <span className="text-[#68a063]">⬢</span>
                <span>Node.js</span>
              </div>

              {/* Express.js */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
                <span className="rounded bg-black/40 px-1 py-0.2 text-[10px] font-mono">ex</span>
                <span>Express.js</span>
              </div>

              {/* MySQL */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
                <span className="text-amber-300">🐬</span>
                <span>MySQL</span>
              </div>

              {/* JavaScript */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
                <span className="rounded bg-[#f7df1e] px-1 py-0.2 text-[10px] font-bold text-black">JS</span>
                <span>JavaScript</span>
              </div>
            </div>
          </div>

          {/* =========================================
              CENTER PORTRAIT (Col 6-9)
          ========================================= */}
          <div className="relative flex items-end justify-center self-end lg:col-span-4">
            <div className="relative flex items-end justify-center">
              {/* Subtle back ambient circle behind head */}
              <div className="absolute top-12 h-64 w-64 rounded-full bg-purple-400/20 blur-xl" />
              
              <img
                src={profileImage}
                alt={name}
                className="relative z-10 max-h-[420px] w-auto object-contain drop-shadow-2xl sm:max-h-[480px] lg:max-h-[530px]"
              />
            </div>
          </div>

          {/* =========================================
              RIGHT STAT CARDS & SLOGAN (Col 10-12)
          ========================================= */}
          <div className="flex flex-col items-center justify-center gap-3.5 pb-6 lg:col-span-3 lg:items-end lg:pb-12">
            
            {/* Stat Card 1: Projects Completed */}
            <div className="flex w-full max-w-[230px] items-center gap-3.5 rounded-2xl border border-white/20 bg-white/10 p-3.5 text-white backdrop-blur-md shadow-lg shadow-purple-950/20 transition-all hover:bg-white/15">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-inner">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold leading-tight text-white">3+</p>
                <p className="text-xs font-medium text-purple-200/80">Projects Completed</p>
              </div>
            </div>

            {/* Stat Card 2: Full Stack Development */}
            <div className="flex w-full max-w-[230px] items-center gap-3.5 rounded-2xl border border-white/20 bg-white/10 p-3.5 text-white backdrop-blur-md shadow-lg shadow-purple-950/20 transition-all hover:bg-white/15">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-inner">
                <Code2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-bold leading-tight text-white">Full Stack</p>
                <p className="text-xs font-medium text-purple-200/80">Development</p>
              </div>
            </div>

            {/* Stat Card 3: Open to Opportunities */}
            <div className="flex w-full max-w-[230px] items-center gap-3.5 rounded-2xl border border-white/20 bg-white/10 p-3.5 text-white backdrop-blur-md shadow-lg shadow-purple-950/20 transition-all hover:bg-white/15">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-inner">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-bold leading-tight text-white">Open to</p>
                <p className="text-xs font-medium text-purple-200/80">Opportunities</p>
              </div>
            </div>

            {/* Handwritten Script Watermark / Slogan */}
            <div className="mt-2 text-center lg:text-right">
              <p className="font-script text-2xl font-semibold text-purple-200/90 drop-shadow sm:text-[28px]">
                Code. Create.
                <br />
                Make an Impact ♡
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
