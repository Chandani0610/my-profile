// components/Education.jsx
import { GraduationCap, Calendar, Building2, Award, Sparkles } from "lucide-react";

export default function Education({ education }) {
  const defaultEducation = [
    {
      degree: "B.Tech",
      field: "Computer Science & Engineering",
      institution: "IES College of Technology",
      marks: "8.36",
      year: "June 2022 - June 2026",
      status: "Graduating 2026",
      highlight: true
    },
    {
      degree: "12th",
      field: "Higher Secondary (Science)",
      institution: "JN College Madhubani",
      marks: "71.2%",
      year: "March 2021 - March 2022",
      status: "Completed",
      highlight: false
    },
    {
      degree: "10th",
      field: "Secondary School",
      institution: "Bilat Singh Girls School Khajauli",
      marks: "71.2%",
      year: "March 2019 - March 2020",
      status: "Completed",
      highlight: false
    }
  ];

  const items = (education && education.length > 0) ? education : defaultEducation;

  return (
    <section id="education" className="relative w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-700 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              <span>EDUCATION</span>
              <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
              <span>Academic Background</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Academic Background
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Educational journey, formal degrees, and academic performance milestones.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200/80 rounded-full px-4 py-1.5 w-fit">
            <GraduationCap className="h-4 w-4 text-purple-600" />
            <span>Computer Science Graduate (2026)</span>
          </div>
        </div>

        {/* 3 Education Cards Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {items.map((item, idx) => {
            const isLatest = idx === 0 || item.year?.includes("2026");
            const college = item.institution || item.college || "College / School";
            const score = item.marks || item.score || "";

            return (
              <div
                key={idx}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                  isLatest
                    ? "border-purple-200 ring-1 ring-purple-100/80 hover:border-purple-300"
                    : "border-slate-200/80 hover:border-purple-200"
                }`}
              >
                {/* Top Year & Status Pill */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                      <Calendar className="h-3 w-3 text-purple-600" />
                      <span>{item.year}</span>
                    </span>

                    {score && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        <Award className="h-3 w-3 text-emerald-600" />
                        <span>• {score}</span>
                      </span>
                    )}
                  </div>

                  {/* Degree Name */}
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                      isLatest 
                        ? "bg-purple-100 text-purple-700 shadow-xs" 
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      <GraduationCap className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-purple-700 transition-colors">
                        {item.degree}
                      </h3>
                      {item.field && (
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {item.field}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* College / Institution Bottom Info */}
                <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Building2 className="h-4 w-4 text-purple-600 shrink-0" />
                    <span className="truncate">{college}</span>
                  </div>
                  {score && (
                    <span className="text-xs font-bold text-purple-700 shrink-0">
                      • {score}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
