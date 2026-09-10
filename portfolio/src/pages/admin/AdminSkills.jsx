// pages/admin/AdminSkills.jsx
import { useEffect, useState } from "react";
import { 
  Zap, 
  Plus, 
  Trash2, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Code,
  Layout,
  Server,
  Database,
  Wrench,
  BookOpen,
  X
} from "lucide-react";

import API from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";

const categories = [
  { key: "frontend", label: "Frontend", icon: <Layout className="h-4 w-4" /> },
  { key: "backend", label: "Backend", icon: <Server className="h-4 w-4" /> },
  { key: "database", label: "Database", icon: <Database className="h-4 w-4" /> },
  { key: "languages", label: "Programming Languages", icon: <Code className="h-4 w-4" /> },
  { key: "tools", label: "Tools & Platforms", icon: <Wrench className="h-4 w-4" /> },
  { key: "coreSubjects", label: "Core CS Subjects", icon: <BookOpen className="h-4 w-4" /> },
];

const defaultSkills = {
  frontend: ["React.js", "Tailwind CSS", "Material Tailwind", "HTML", "CSS", "JavaScript"],
  backend: ["Node.js", "Express.js", "REST APIs", "JWT"],
  database: ["MySQL", "Oracle SQL"],
  languages: ["C", "C++", "Core Java", "JavaScript", "SQL"],
  tools: ["Git", "GitHub", "VS Code", "Postman", "LeetCode"],
  coreSubjects: ["Data Structures & Algorithms", "DBMS", "OOP", "Operating Systems", "Computer Networks", "Cloud Computing"],
};

export default function AdminSkills() {
  const { currentTheme } = useTheme();

  const [skills, setSkills] = useState(defaultSkills);
  const [selectedCategory, setSelectedCategory] = useState("frontend");
  const [newSkillName, setNewSkillName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingSkill, setDeletingSkill] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showToast = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4500);
  };

  const loadSkills = async () => {
    try {
      setLoading(true);
      const res = await API.get("/portfolio");
      if (res.data?.success && res.data.data?.skills) {
        const raw = res.data.data.skills;
        if (typeof raw === "object" && !Array.isArray(raw)) {
          setSkills((prev) => ({ ...prev, ...raw }));
        } else if (Array.isArray(raw)) {
          // group by category
          const grouped = { ...defaultSkills };
          raw.forEach((s) => {
            const cat = s.category || "frontend";
            if (!grouped[cat]) grouped[cat] = [];
            if (s.skill_name && !grouped[cat].includes(s.skill_name)) {
              grouped[cat].push(s.skill_name);
            }
          });
          setSkills(grouped);
        }
      }
    } catch (err) {
      console.error("Load skills error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const clean = newSkillName.trim();
    if (!clean) return;

    const currentList = skills[selectedCategory] || [];
    if (currentList.some((s) => s.toLowerCase() === clean.toLowerCase())) {
      showToast("Skill already exists in this category", "error");
      return;
    }

    try {
      setSaving(true);
      try {
        await API.post("/admin/skills", {
          category: selectedCategory,
          skill_name: clean,
        });
      } catch {
        // local update
      }

      setSkills((prev) => ({
        ...prev,
        [selectedCategory]: [...(prev[selectedCategory] || []), clean],
      }));
      setNewSkillName("");
      showToast("Added \"" + clean + "\" to " + selectedCategory + "!", "success");
    } catch (err) {
      showToast("Failed to add skill", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (catKey, skillName) => {
    if (!window.confirm("Remove \"" + skillName + "\" from " + catKey + "?")) return;

    try {
      setDeletingSkill(skillName);
      try {
        await API.delete("/admin/skills/" + encodeURIComponent(skillName));
      } catch {
        // local delete
      }

      setSkills((prev) => ({
        ...prev,
        [catKey]: (prev[catKey] || []).filter((s) => s !== skillName),
      }));
      showToast("Removed \"" + skillName + "\"", "success");
    } catch {
      showToast("Failed to remove skill", "error");
    } finally {
      setDeletingSkill(null);
    }
  };

  // Calculate total skills
  const totalSkillsCount = Object.values(skills).reduce(
    (total, list) => total + (Array.isArray(list) ? list.length : 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-white selection:bg-purple-500 selection:text-white">
      <AdminSidebar />

      <main className="ml-64 min-h-screen p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Technical Arsenal</span>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold text-white">
              Skills & Stack Manager
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Organize your technical competencies across frontend, backend, database, languages, and tools.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadSkills}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <RefreshCw className={"h-3.5 w-3.5 " + (loading ? "animate-spin" : "")} />
              <span>Refresh</span>
            </button>

            <a
              href="/#skills"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-950/40 px-3.5 py-2 text-xs font-semibold text-purple-300 transition hover:bg-purple-900/50"
            >
              <span>View On Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Status Toast */}
        {message && (
          <div
            className={"mb-6 flex items-center gap-3 rounded-2xl p-4 text-sm font-medium shadow-lg transition-all " + (
              messageType === "success"
                ? "border border-emerald-500/30 bg-emerald-950/50 text-emerald-300 shadow-emerald-900/20"
                : "border border-rose-500/30 bg-rose-950/50 text-rose-300 shadow-rose-900/20"
            )}
          >
            {messageType === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            <span>{message}</span>
          </div>
        )}

        {/* Top Add Skill Form Bar */}
        <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Plus className="h-4 w-4 text-purple-400" />
            <span>Add Skill to Category</span>
          </h3>

          <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row items-center gap-3">
            {/* Category select */}
            <div className="w-full sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-purple-500 focus:outline-none transition capitalize"
              >
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Skill name input */}
            <div className="relative flex-1 w-full">
              <input
                type="text"
                required
                placeholder="Enter skill name (e.g. Next.js, Docker, TypeScript)..."
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
              />
            </div>

            {/* Add Button */}
            <button
              type="submit"
              disabled={saving || !newSkillName.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>Add Skill</span>
            </button>
          </form>
        </div>

        {/* Search & Total Counter Toolbar */}
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search across all technical skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
            />
          </div>

          <span className="shrink-0 text-xs font-bold text-purple-300 px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/30">
            {totalSkillsCount} Skills Total
          </span>
        </div>

        {/* Categorized Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const rawList = skills[cat.key] || [];
            const skillList = rawList.filter((s) =>
              !searchTerm.trim() || s.toLowerCase().includes(searchTerm.toLowerCase())
            );

            return (
              <div
                key={cat.key}
                className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl hover:border-slate-700 transition"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                        {cat.icon}
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        {cat.label}
                      </h4>
                    </div>
                    <span className="rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-[11px] font-bold text-purple-300">
                      {rawList.length}
                    </span>
                  </div>

                  {/* Skills Tag Cloud */}
                  {skillList.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500">
                      {searchTerm ? "No matching skills in this category" : "No skills added yet"}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {skillList.map((skill, idx) => (
                        <div
                          key={idx}
                          className="group inline-flex items-center gap-1.5 rounded-xl bg-slate-950 border border-slate-700/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-purple-500/50 transition"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteSkill(cat.key, skill)}
                            className="text-slate-500 hover:text-rose-400 rounded-full p-0.5 transition"
                            title={"Remove " + skill}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Category: {cat.key}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.key);
                      window.scrollTo({ top: 120, behavior: "smooth" });
                    }}
                    className="text-purple-400 hover:underline font-semibold"
                  >
                    + Add to {cat.label}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
