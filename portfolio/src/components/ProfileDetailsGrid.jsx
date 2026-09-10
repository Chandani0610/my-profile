// components/ProfileDetailsGrid.jsx
import { Palette, Music, Heart, Globe, Sparkles } from "lucide-react";

export default function ProfileDetailsGrid({ data }) {
  const languages = data?.languages || [
    {
      name: "English",
      level: "Professional Working Proficiency",
      icon: "🌐",
    },
    {
      name: "Hindi",
      level: "Native",
      icon: "🇮🇳",
    },
    {
      name: "Maithili",
      level: "Mother Tongue",
      icon: "🧡",
    },
  ];

  const hobbies = data?.hobbies || [
    {
      name: "Painting",
      description: "I love creating art, especially Mithila painting.",
      icon: <Palette className="h-4 w-4 text-purple-600" />,
    },
    {
      name: "Music",
      description: "Music keeps me relaxed, focused and inspired.",
      icon: <Music className="h-4 w-4 text-indigo-600" />,
    },
  ];

  return (
    <section id="hobbies" className="relative w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* =========================================
              COL 1: LANGUAGES (Col 1-5)
          ========================================= */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-purple-600" />
                  <h3 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
                    LANGUAGES
                  </h3>
                </div>
                <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-700">
                  {languages.length} Languages
                </span>
              </div>

              <div className="mt-6 space-y-3.5">
                {languages.map((lang, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 transition hover:border-purple-200 hover:bg-slate-50 hover:shadow-xs">
                    <span className="text-2xl leading-none pt-0.5">{lang.icon || lang.flag || "🌐"}</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {lang.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        {lang.level}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 text-xs text-slate-400">
              Clear & effective communication across multicultural engineering teams.
            </p>
          </div>

          {/* =========================================
              COL 2: HOBBIES & INTERESTS (Col 6-12)
          ========================================= */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <h3 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
                    HOBBIES & INTERESTS
                  </h3>
                </div>
                <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-700">
                  Creativity & Leisure
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hobbies.map((hobby, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-purple-200 hover:bg-slate-50 hover:shadow-xs">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-100/80 text-purple-700 shadow-xs">
                      {hobby.icon || <Heart className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {hobby.name}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        {hobby.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mithila Art Peacock Illustration */}
            <div className="relative mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs italic text-slate-400">
                Traditional Mithila painting & arts cultural heritage
              </span>
              <div className="opacity-90">
                <svg width="110" height="85" viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="65" cy="70" rx="35" ry="24" fill="#8b5cf6" fillOpacity="0.2" stroke="#6d28d9" strokeWidth="2.5" strokeDasharray="3 3"/>
                  <path d="M70 55 C 80 40, 95 45, 100 60 C 105 75, 90 90, 75 90" stroke="#7c3aed" strokeWidth="2.5" fill="none"/>
                  <circle cx="102" cy="55" r="9" fill="#6d28d9"/>
                  <circle cx="104" cy="53" r="2.5" fill="white"/>
                  <path d="M111 55 L 122 58 L 111 61 Z" fill="#ea580c"/>
                  <path d="M100 46 L 96 32 M103 46 L 104 30 M106 47 L 112 33" stroke="#d97706" strokeWidth="2"/>
                  <circle cx="96" cy="31" r="2.5" fill="#f59e0b"/>
                  <circle cx="104" cy="29" r="2.5" fill="#10b981"/>
                  <circle cx="112" cy="32" r="2.5" fill="#ec4899"/>
                  <path d="M45 75 C 25 70, 10 55, 15 35 C 20 20, 40 25, 48 45" stroke="#ec4899" strokeWidth="2.5" fill="#fdf2f8"/>
                  <circle cx="25" cy="35" r="4" fill="#06b6d4"/>
                  <circle cx="25" cy="35" r="2" fill="#f59e0b"/>
                  <path d="M40 82 C 15 85, 5 70, 8 50 C 10 35, 30 40, 38 60" stroke="#10b981" strokeWidth="2" fill="#ecfdf5"/>
                  <circle cx="15" cy="55" r="4" fill="#7c3aed"/>
                  <circle cx="15" cy="55" r="2" fill="#fbbf24"/>
                  <path d="M55 65 C58 60, 64 60, 67 65 M60 70 C63 65, 69 65, 72 70 M53 74 C56 69, 62 69, 65 74" stroke="#6d28d9" strokeWidth="1.5"/>
                </svg>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
