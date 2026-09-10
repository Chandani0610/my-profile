// components/Languages.jsx
import { Globe, CheckCircle2 } from "lucide-react";
import resumeData from "../data/resumeData";

export default function Languages({ languages: customLanguages }) {
  const fallbackLanguages = resumeData.languages || [];
  const rawList = (customLanguages && customLanguages.length > 0) ? customLanguages : fallbackLanguages;

  const normalizedLanguages = rawList.map((lang, idx) => {
    const name = lang.name || lang.language_name || "Language";
    let flag = lang.flag || lang.icon;
    let level = lang.level || lang.proficiency_level;

    if (name.toLowerCase().includes("english")) {
      flag = flag || "🇬🇧";
      level = level || "Fluent";
    } else if (name.toLowerCase().includes("hindi")) {
      flag = flag || "🇮🇳";
      level = level || "Native";
    } else if (name.toLowerCase().includes("maithili")) {
      flag = flag || "🧡";
      level = level || "Mother Tongue";
    } else {
      flag = flag || "🌐";
      level = level || "Proficient";
    }

    return {
      id: lang.id || idx + 1,
      name,
      flag,
      level,
    };
  });

  return (
    <section id="languages" className="relative w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-700 mb-3">
              <Globe className="h-3.5 w-3.5 text-purple-600" />
              <span>LANGUAGES</span>
              <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
              <span>{normalizedLanguages.length} Languages</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Multilingual Communication
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
              Fluent and native communication proficiency across global teams, cross-functional collaborators, and regional stakeholders.
            </p>
          </div>
        </div>

        {/* 3 Languages Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {normalizedLanguages.map((lang) => (
            <div
              key={lang.id}
              className="group flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-md hover:shadow-purple-500/10"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 shadow-xs text-3xl group-hover:scale-110 transition-transform">
                  {lang.flag}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                    {lang.name}
                  </h3>
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-100/60">
                    <CheckCircle2 className="h-3 w-3 text-purple-600" />
                    <span>{lang.level}</span>
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-end text-[11px] text-slate-400 font-medium">
                <span>Spoken & Written</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
