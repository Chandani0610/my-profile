// components/AboutMe.jsx
import { Check, Target, ArrowUpRight, Sparkles } from "lucide-react";

export default function AboutMe({ data }) {
  const about =
    data?.about ||
    "I'm a Computer Science graduate from IES College of Technology, Madhubani, Bihar. I enjoy combining thoughtful UI design with practical full-stack development. I'm passionate about building web and mobile applications that are simple, fast and useful.";

  const approachItems = data?.approach || [
    "Clean and maintainable code",
    "Responsive & accessible UI",
    "Reusable components",
    "Continuous learning"
  ];

  return (
    <section id="about" className="relative w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* =========================================
              CARD 1: ABOUT ME (Col 1-7)
          ========================================= */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-8 shadow-xs transition-all duration-300 hover:shadow-md lg:col-span-7">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-700 mb-3">
                <Sparkles className="h-3 w-3 text-purple-600" />
                <span>ABOUT ME</span>
              </div>
              
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl leading-snug">
                Designing digital experiences with purpose
              </h2>
              
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-600">
                {about}
              </p>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Spoken Languages Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-100/60 px-3 py-1 text-xs font-medium text-purple-800">
                    <span>🌐</span>
                    <span>English</span>
                  </span>
                  <span className="inline-flex items-center rounded-full bg-purple-50 border border-purple-100/60 px-3 py-1 text-xs font-medium text-purple-800">
                    Hindi
                  </span>
                  <span className="inline-flex items-center rounded-full bg-purple-50 border border-purple-100/60 px-3 py-1 text-xs font-medium text-purple-800">
                    Maithili
                  </span>
                </div>

                {/* Location */}
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-800">
                    <span>📍</span>
                    <span>Based in Madhubani, Bihar</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              CARD 2: MY APPROACH (Col 8-12)
          ========================================= */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-8 shadow-xs transition-all duration-300 hover:shadow-md lg:col-span-5">
            <div>
              {/* Header with target icon */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700 shadow-2xs">
                  <Target className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    My Approach
                  </h3>
                  <p className="text-xs text-slate-500">Core engineering principles</p>
                </div>
              </div>

              {/* Checklist */}
              <ul className="mt-6 space-y-3.5">
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
              className="focus-architecture-badge mt-8 rounded-2xl p-4 text-center text-white transition-all duration-300 shadow-md cursor-default"
              style={{
                background: 'linear-gradient(135deg, var(--theme-primary, #7c3aed), var(--theme-primary-dark, #6d28d9))',
                boxShadow: '0 4px 14px 0 var(--theme-glow, rgba(124, 58, 237, 0.25))',
              }}
            >
              <p className="text-xs sm:text-sm font-bold text-white tracking-wide">
                ⚡ Focus on scalable architecture & clean UX
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
