import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";

const skillCategories = ["frontend", "backend", "database", "other"];

export default function AdminSkills() {
  const navigate = useNavigate();
  const { themeColors, currentTheme } = useTheme();

  const [skills, setSkills] = useState({});
  const [category, setCategory] = useState("frontend");
  const [skillName, setSkillName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState(null);

  // Theme color swatches
  const themeColorSwatches = {
    blue: '#08bde0',
    purple: '#7c3aed',
    green: '#059669',
    red: '#dc2626',
    orange: '#ea580c',
    dark: '#38bdf8',
  };

  const getThemeColor = () => {
    return themeColorSwatches[currentTheme] || themeColorSwatches.blue;
  };

  // ✅ Updated useEffect with AbortController for cleanup
  useEffect(() => {
    const abortController = new AbortController();

    const loadSkills = async () => {
      try {
        setLoading(true);
        const response = await API.get("/portfolio", {
          signal: abortController.signal
        });

        if (response.data.success) {
          setSkills(response.data.data.skills || {});
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Failed to load skills:", error);
          setMessage("❌ Failed to load skills.");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadSkills();

    return () => {
      abortController.abort();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedSkill = skillName.trim();
    if (!trimmedSkill) return;

    // Check if skill already exists in this category
    const currentSkills = skills[category] || [];
    if (currentSkills.includes(trimmedSkill)) {
      setMessage(`⚠️ "${trimmedSkill}" already exists in ${category}.`);
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const updatedSkills = [...currentSkills, trimmedSkill];

      await API.put(`/admin/skills/${category}`, {
        skills: updatedSkills,
      });

      setSkills({ ...skills, [category]: updatedSkills });
      setSkillName("");
      setMessage(`✅ Skill added to ${category} successfully.`);
      
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "❌ Failed to add skill."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteSkill = async (category, skillToDelete) => {
    const confirmed = window.confirm(
      `Remove "${skillToDelete}" from ${category}?`
    );
    if (!confirmed) return;

    setDeleting(skillToDelete);
    setMessage("");

    try {
      const currentSkills = skills[category] || [];
      const updatedSkills = currentSkills.filter(
        (skill) => skill !== skillToDelete
      );

      await API.put(`/admin/skills/${category}`, {
        skills: updatedSkills,
      });

      setSkills({ ...skills, [category]: updatedSkills });
      setMessage(`✅ Skill removed successfully.`);
      
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "❌ Failed to remove skill."
      );
    } finally {
      setDeleting(null);
    }
  };

  // Get total skill count
  const totalSkills = Object.values(skills).reduce(
    (total, skillsArray) => total + (Array.isArray(skillsArray) ? skillsArray.length : 0),
    0
  );

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: themeColors?.background || '#0f172a',
        color: themeColors?.text || '#ffffff',
      }}
    >
      <AdminSidebar />

      <main className="ml-64 min-h-screen p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p 
              className="text-sm font-medium"
              style={{ color: getThemeColor() }}
            >
              ADMIN / SKILLS
            </p>
            <h1 className="mt-2 text-3xl font-bold">Manage Skills</h1>
            <p 
              className="mt-1 text-sm"
              style={{ color: themeColors?.textSecondary || '#94a3b8' }}
            >
              {totalSkills} skills across {Object.keys(skills).filter(key => skills[key]?.length > 0).length} categories
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="rounded-xl border px-4 py-2 text-sm transition hover:bg-white/10"
            style={{
              borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
              color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)',
            }}
          >
            ← Dashboard
          </button>
        </div>

        {message && (
          <div 
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              message.includes("✅") 
                ? "border-green-400/20 bg-green-400/10 text-green-300"
                : message.includes("⚠️")
                ? "border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
                : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
            }`}
          >
            {message}
          </div>
        )}

        <div 
          className="mb-10 rounded-2xl border p-6"
          style={{
            borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
            backgroundColor: themeColors?.cardBg || 'rgba(255,255,255,0.05)',
          }}
        >
          <h2 className="mb-6 text-xl font-semibold">Add New Skill</h2>

          <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Skill Name <span className="text-cyan-400 ml-1">*</span>
              </label>
              <input
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="React.js"
                required
                className="w-full rounded-xl border px-4 py-3 outline-none transition placeholder:text-gray-400 focus:ring-2"
                style={{
                  borderColor: '#d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = getThemeColor();
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${getThemeColor()}30`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Category <span className="text-cyan-400 ml-1">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2"
                style={{
                  borderColor: '#d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = getThemeColor();
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${getThemeColor()}30`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {skillCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving || !skillName.trim()}
                className="rounded-xl px-6 py-3 font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: getThemeColor(),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.85';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {saving ? (
                  <>
                    <span className="inline-block h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Adding...
                  </>
                ) : (
                  "Add Skill"
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 border-t pt-4" style={{ borderColor: themeColors?.border || 'rgba(255,255,255,0.05)' }}>
            <p className="text-xs" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.2)' }}>
              Skills are displayed on the portfolio's Skills section.
            </p>
          </div>
        </div>

        {/* SKILLS LIST - WHITE CARDS WITH DARK TEXT */}
        <div 
          className="rounded-2xl border p-6"
          style={{
            borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
            backgroundColor: themeColors?.cardBg || 'rgba(255,255,255,0.05)',
          }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Skills</h2>
            {!loading && totalSkills > 0 && (
              <span 
                className="rounded-full px-3 py-1 text-xs"
                style={{
                  backgroundColor: `${getThemeColor()}20`,
                  color: getThemeColor(),
                }}
              >
                {totalSkills} total
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div 
                  className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
                  style={{
                    borderColor: `${getThemeColor()}40`,
                    borderTopColor: getThemeColor(),
                  }}
                />
                <p className="text-white/50">Loading skills...</p>
              </div>
            </div>
          ) : Object.keys(skills).length === 0 || totalSkills === 0 ? (
            <div 
              className="rounded-xl border p-8 text-center"
              style={{
                borderColor: '#d1d5db',
                backgroundColor: '#ffffff',
              }}
            >
              <p className="text-gray-500">No skills found. Add your first skill above!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {skillCategories.map((cat) => {
                const skillList = skills[cat] || [];
                if (skillList.length === 0) return null;

                return (
                  <div
                    key={cat}
                    className="rounded-xl border p-5 transition shadow-sm hover:shadow-md"
                    style={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                    }}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold capitalize" style={{ color: getThemeColor() }}>
                        {cat}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {skillList.length} skill{skillList.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillList.map((skill) => (
                        <span
                          key={skill}
                          className="group flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition hover:border-gray-300"
                          style={{
                            borderColor: '#e5e7eb',
                            backgroundColor: '#f9fafb',
                            color: '#1f2937',
                          }}
                        >
                          {skill}
                          <button
                            onClick={() => deleteSkill(cat, skill)}
                            disabled={deleting === skill}
                            className="text-gray-400 transition hover:text-red-500 disabled:opacity-50"
                          >
                            {deleting === skill ? (
                              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                            ) : (
                              "×"
                            )}
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}