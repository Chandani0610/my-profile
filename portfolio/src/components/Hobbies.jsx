// components/Hobbies.jsx
import { Sparkles, Palette, Music, Heart } from "lucide-react";
import resumeData from "../data/resumeData";

export default function Hobbies({ hobbies: customHobbies }) {
  const fallbackHobbies = resumeData.hobbies || [];
  const rawList = (customHobbies && customHobbies.length > 0) ? customHobbies : fallbackHobbies;

  const normalizedHobbies = rawList.map((h, idx) => {
    const name = h.name || h.hobby_name || "Creative Pursuit";
    let icon = h.icon;
    let description = h.description;

    if (name.toLowerCase().includes("paint")) {
      icon = "🎨";
      description = description || "Traditional Mithila painting & arts cultural heritage. Creating geometric and folk artwork celebrating Mithila traditions.";
    } else if (name.toLowerCase().includes("music")) {
      icon = "🎵";
      description = description || "Music keeps me relaxed, focused and inspired.";
    } else {
      icon = icon || "✨";
      description = description || "Creative hobby and leisure activity.";
    }

    return {
      id: h.id || idx + 1,
      name,
      icon,
      description
    };
  });

  return (
    <section id="hobbies" className="relative w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-700 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              <span>HOBBIES & INTERESTS</span>
              <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
              <span>Creativity & Leisure</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Creativity & Leisure
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
              Creative pursuits and cultural heritage outside of coding that inspire artistic vision and creative problem solving.
            </p>
          </div>
        </div>

        {/* Hobbies Cards Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Hobbies Cards (Col 1-5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {normalizedHobbies.map((hobby) => (
              <div
                key={hobby.id}
                className="group flex flex-col justify-between gap-3.5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-md hover:shadow-purple-500/10"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-50 border border-purple-100/80 text-2xl shadow-xs group-hover:scale-110 transition-transform">
                    {hobby.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      {hobby.name}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {hobby.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="text-purple-600 font-semibold">Personal Passion</span>
                  <span>Creative Balance</span>
                </div>
              </div>
            ))}
          </div>

          {/* Cultural Heritage Card (Col 6-12) */}
          <div className="lg:col-span-7 rounded-3xl border border-purple-200/80 bg-transparent p-6 sm:p-8 shadow-xs flex flex-col justify-between transition-all duration-300 hover:border-purple-300/80">
            <div>
              {/* Header with Badges */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎨</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                    Cultural Heritage
                  </span>
                </div>

                <span className="rounded-full bg-transparent px-3 py-1 text-[11px] font-bold text-purple-700 border border-purple-200/80">
                  Madhubani, Bihar
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="mt-3 text-lg sm:text-xl font-bold text-slate-900">
                Traditional Mithila Painting & Arts
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Rooted in Madhubani, Bihar — celebrating the rich heritage of Mithila folk art with intricate geometric lines, vibrant natural pigments, and traditional peacock motifs.
              </p>

              {/* Traditional Elements Chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-xl bg-transparent px-2.5 py-1 text-[11px] font-semibold text-purple-700 border border-purple-200/80 shadow-2xs">
                  ✨ Kachni (Fine Line Art)
                </span>
                <span className="rounded-xl bg-transparent px-2.5 py-1 text-[11px] font-semibold text-purple-700 border border-purple-200/80 shadow-2xs">
                  🌸 Bharni (Vibrant Colors)
                </span>
                <span className="rounded-xl bg-transparent px-2.5 py-1 text-[11px] font-semibold text-purple-700 border border-purple-200/80 shadow-2xs">
                  🦚 Mayur (Peacock Motif)
                </span>
              </div>
            </div>

            {/* Bottom Row: Text on Left + Compact Improved Bird on Right (Same Size as Previous) */}
            <div className="relative mt-6 flex items-center justify-between pt-4 border-t border-purple-100">
              <span className="text-xs italic font-medium text-purple-700 max-w-[280px] leading-relaxed">
                Traditional Mithila painting & arts cultural heritage
              </span>
              
              {/* Compact, Improved Mithila Peacock Vector */}
              <div className="shrink-0 ml-3 opacity-95 transition-transform hover:scale-105 duration-300">
                <svg 
                  width="118" 
                  height="90" 
                  viewBox="0 0 140 120" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Subtle Aura Halo */}
                  <ellipse cx="68" cy="74" rx="36" ry="24" fill="var(--color-purple-500)" fillOpacity="0.18" stroke="var(--color-purple-600)" strokeWidth="2" strokeDasharray="3 3"/>

                  {/* Branch Perch */}
                  <path d="M 32 108 Q 70 103 136 108" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="128" cy="107" r="3.5" fill="#f43f5e" />
                  <path d="M 128 107 C 124 100 124 95 128 90 C 132 95 132 100 128 107 Z" fill="#ec4899" />
                  <path d="M 115 106 Q 120 100 125 106" stroke="#16a34a" strokeWidth="1.5" fill="none" />

                  {/* Claws */}
                  <path d="M 72 100 L 74 107 M 74 107 L 68 109 M 74 107 L 79 109" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Body & Wing */}
                  <path d="M 64 68 C 82 66 94 75 92 88 C 90 98 75 103 62 98 C 48 94 48 80 64 68 Z" fill="var(--color-purple-500)" fillOpacity="0.3" stroke="var(--color-purple-700)" strokeWidth="2" />
                  
                  {/* Inner Wing with Kachni Scallops */}
                  <path d="M 68 74 C 78 76 84 82 82 90 C 76 92 70 90 66 84 Z" fill="#ec4899" fillOpacity="0.3" stroke="#db2777" strokeWidth="1.5" />
                  <path d="M 70 80 Q 74 78 78 82 M 68 85 Q 72 83 76 87" stroke="#db2777" strokeWidth="1.2" fill="none" />

                  {/* Graceful S-Curved Neck */}
                  <path d="M 74 68 C 80 54 88 48 97 45 C 104 42 108 46 106 53 C 102 62 86 70 80 75" fill="var(--color-purple-700)" stroke="var(--color-purple-800)" strokeWidth="1.5" />

                  {/* Gold & Coral Neck Collars */}
                  <path d="M 83 61 Q 88 59 93 57" stroke="#fbbf24" strokeWidth="2" fill="none" />
                  <path d="M 81 66 Q 86 64 91 62" stroke="#f43f5e" strokeWidth="1.8" fill="none" />

                  {/* Head & Almond Eye */}
                  <circle cx="102" cy="45" r="7.5" fill="var(--color-purple-600)" stroke="var(--color-purple-800)" strokeWidth="1.5" />
                  <path d="M 98 45 Q 102 41 106 45 Q 102 49 98 45 Z" fill="#ffffff" stroke="#1e1b4b" strokeWidth="1" />
                  <circle cx="103" cy="45" r="1.8" fill="#0f172a" />
                  <circle cx="102.5" cy="44.5" r="0.6" fill="#ffffff" />
                  <path d="M 106 45 Q 109 44 111 43" stroke="#1e1b4b" strokeWidth="1" fill="none" />

                  {/* Beak with Flower Bud */}
                  <path d="M 107 45 L 121 47 L 107 50 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
                  <path d="M 121 47 Q 128 51 130 57" stroke="#15803d" strokeWidth="1.5" fill="none" />
                  <circle cx="130" cy="57" r="2.5" fill="#f43f5e" />

                  {/* Royal Crown Plumes (Kalgi) with Gems */}
                  <path d="M 100 38 Q 96 26 91 20" stroke="#b45309" strokeWidth="1.5" fill="none" />
                  <circle cx="91" cy="20" r="2.5" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />

                  <path d="M 103 38 Q 104 24 106 17" stroke="#b45309" strokeWidth="1.5" fill="none" />
                  <circle cx="106" cy="17" r="3" fill="#10b981" stroke="#047857" strokeWidth="0.8" />
                  <circle cx="106" cy="17" r="1" fill="#ffffff" />

                  <path d="M 105 39 Q 112 26 118 22" stroke="#b45309" strokeWidth="1.5" fill="none" />
                  <circle cx="118" cy="22" r="2.5" fill="#ec4899" stroke="#be185d" strokeWidth="0.8" />

                  {/* Fanned Tail Feathers (Mayur Pankh) with Rich Ocelli Eyes */}
                  {/* Feather 1 (Top Left) */}
                  <path d="M 60 72 Q 40 55 24 35" stroke="var(--color-purple-600)" strokeWidth="1.8" fill="none" />
                  <ellipse cx="24" cy="35" rx="8" ry="6" transform="rotate(-30 24 35)" fill="#0d9488" stroke="#042f2e" strokeWidth="1" />
                  <ellipse cx="24" cy="35" rx="5" ry="3.8" transform="rotate(-30 24 35)" fill="#6366f1" />
                  <circle cx="24" cy="35" r="2" fill="#fbbf24" />
                  <circle cx="24" cy="35" r="0.9" fill="#1e1b4b" />

                  {/* Feather 2 (Mid-High Left) */}
                  <path d="M 55 76 Q 30 65 14 55" stroke="var(--color-purple-600)" strokeWidth="1.8" fill="none" />
                  <ellipse cx="14" cy="55" rx="8" ry="6" transform="rotate(-60 14 55)" fill="#0d9488" stroke="#042f2e" strokeWidth="1" />
                  <ellipse cx="14" cy="55" rx="5" ry="3.8" transform="rotate(-60 14 55)" fill="#db2777" />
                  <circle cx="14" cy="55" r="2" fill="#fbbf24" />
                  <circle cx="14" cy="55" r="0.9" fill="#1e1b4b" />

                  {/* Feather 3 (Lower Left) */}
                  <path d="M 52 82 Q 28 80 15 78" stroke="var(--color-purple-600)" strokeWidth="1.8" fill="none" />
                  <ellipse cx="15" cy="78" rx="7.5" ry="5.5" transform="rotate(-85 15 78)" fill="#0d9488" stroke="#042f2e" strokeWidth="1" />
                  <ellipse cx="15" cy="78" rx="4.8" ry="3.5" transform="rotate(-85 15 78)" fill="#6366f1" />
                  <circle cx="15" cy="78" r="2" fill="#fbbf24" />
                  <circle cx="15" cy="78" r="0.9" fill="#1e1b4b" />

                  {/* Feather 4 (Base Left) */}
                  <path d="M 52 88 Q 35 94 25 94" stroke="var(--color-purple-600)" strokeWidth="1.8" fill="none" />
                  <circle cx="25" cy="94" r="5" fill="#0d9488" stroke="#042f2e" strokeWidth="1" />
                  <circle cx="25" cy="94" r="3" fill="#f59e0b" />
                  <circle cx="25" cy="94" r="1.2" fill="#1e1b4b" />

                  {/* Traditional Mithila Hatching Fringes */}
                  <path d="M 45 60 C 42 55 48 55 52 60 M 36 68 C 33 63 39 63 43 68 M 30 76 C 27 71 33 71 37 76" stroke="var(--color-purple-600)" strokeWidth="1.2" fill="none" />
                </svg>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
