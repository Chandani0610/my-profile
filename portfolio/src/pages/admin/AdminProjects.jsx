import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";

const emptyProject = {
  title: "",
  icon: "",
  tech: "",
  description: "",
  github: "",
  demo: "",
};

export default function AdminProjects() {
  const navigate = useNavigate();
  const { themeColors, currentTheme } = useTheme();

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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

  const loadProjects = async () => {
    try {
      setLoading(true);
      let projectList = [];
      try {
        const response = await API.get("/admin/projects");
        if (response.data?.success && Array.isArray(response.data.data)) {
          projectList = response.data.data;
        }
      } catch {
        // fallback to /portfolio
      }

      if (projectList.length === 0) {
        try {
          const pRes = await API.get("/portfolio");
          if (pRes.data?.success && Array.isArray(pRes.data.data?.projects)) {
            projectList = pRes.data.data.projects;
          }
        } catch (pErr) {
          console.error("Failed to load projects from /portfolio:", pErr);
        }
      }

      setProjects(projectList);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (message) setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const payload = {
        ...form,
        tech: form.tech || form.technologies || "",
        technologies: form.tech || form.technologies || "",
      };

      if (editingId) {
        await API.put(`/admin/projects/${editingId}`, payload);
        setMessage("✅ Project updated successfully.");
      } else {
        await API.post("/admin/projects", payload);
        setMessage("✅ Project created successfully.");
      }

      setForm(emptyProject);
      setEditingId(null);

      await loadProjects();
      setTimeout(() => setMessage(""), 4000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "❌ Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const editProject = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title || "",
      icon: project.icon || "",
      tech: project.tech || project.technologies || "",
      description: project.description || "",
      github: project.github || "",
      demo: project.demo || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmed) return;

    setDeletingId(id);
    setMessage("");

    try {
      await API.delete(`/admin/projects/${id}`);
      setMessage("✅ Project deleted successfully.");
      await loadProjects();
      setTimeout(() => setMessage(""), 4000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "❌ Failed to delete project."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyProject);
  };

  const filteredProjects = projects.filter((p) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (p.title || "").toLowerCase().includes(term) ||
      (p.tech || "").toLowerCase().includes(term) ||
      (p.description || "").toLowerCase().includes(term)
    );
  });

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
              ADMIN / PROJECTS
            </p>
            <h1 className="mt-2 text-3xl font-bold">Manage Projects</h1>
            <p 
              className="mt-1 text-sm"
              style={{ color: themeColors?.textSecondary || '#94a3b8' }}
            >
              {projects.length} project{projects.length !== 1 ? 's' : ''} in your portfolio
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
          <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
            message.includes("✅") 
              ? "border-green-400/20 bg-green-400/10 text-green-300"
              : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
          }`}>
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
          <h2 className="mb-6 text-xl font-semibold">
            {editingId ? "✏️ Edit Project" : "➕ Add New Project"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Title <span className="text-cyan-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="E-Commerce Platform"
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

            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Icon
              </label>
              <input
                type="text"
                name="icon"
                value={form.icon}
                onChange={handleChange}
                placeholder="e.g., 💼, 💰, 🚀"
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
              <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                <span className="text-xs text-gray-400 mr-1">Quick:</span>
                {["💼", "💰", "📖", "🙏", "💻", "🚀", "📱", "🌐", "📊", "🎓"].map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, icon: ic }))}
                    className={`h-7 w-7 rounded-lg text-sm transition hover:scale-110 flex items-center justify-center ${
                      form.icon === ic ? 'bg-cyan-500/20 ring-1 ring-cyan-400' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Technologies <span className="text-cyan-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="tech"
                value={form.tech}
                onChange={handleChange}
                placeholder="React.js + Node.js + MySQL"
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

            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                GitHub URL
              </label>
              <input
                type="text"
                name="github"
                value={form.github}
                onChange={handleChange}
                placeholder="https://github.com/..."
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

            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Demo URL
              </label>
              <input
                type="text"
                name="demo"
                value={form.demo}
                onChange={handleChange}
                placeholder="https://demo.com/..."
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

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Description <span className="text-cyan-400 ml-1">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
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

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
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
                {saving ? "Saving..." : editingId ? "Update Project" : "Add Project"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-xl border px-6 py-3 transition hover:bg-gray-100"
                  style={{
                    borderColor: '#d1d5db',
                    color: '#6b7280',
                    backgroundColor: '#ffffff',
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* PROJECTS LIST - WHITE CARDS WITH DARK TEXT */}
        <div 
          className="rounded-2xl border p-6"
          style={{
            borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
            backgroundColor: themeColors?.cardBg || 'rgba(255,255,255,0.05)',
          }}
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Your Projects</h2>
              <p className="text-xs text-gray-400 mt-1">Manage and preview all portfolio projects</p>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="🔍 Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-xl border px-3.5 py-2 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2"
                style={{
                  borderColor: '#d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                }}
              />
              {!loading && projects.length > 0 && (
                <span 
                  className="rounded-full px-3 py-1 text-xs whitespace-nowrap font-medium"
                  style={{
                    backgroundColor: `${getThemeColor()}20`,
                    color: getThemeColor(),
                  }}
                >
                  {filteredProjects.length} / {projects.length} total
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div 
                  className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
                  style={{
                    borderColor: `${getThemeColor()}40`,
                    borderTopColor: getThemeColor(),
                  }}
                />
                <p className="text-white/50">Loading projects...</p>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div 
              className="rounded-xl border p-12 text-center"
              style={{
                borderColor: '#d1d5db',
                backgroundColor: '#ffffff',
              }}
            >
              <div className="text-5xl mb-3">💼</div>
              <p className="text-gray-500 font-medium">No projects found. Add your first project above!</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div 
              className="rounded-xl border p-12 text-center"
              style={{
                borderColor: '#d1d5db',
                backgroundColor: '#ffffff',
              }}
            >
              <div className="text-5xl mb-3">🔍</div>
              <p className="text-gray-500">No projects match "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-sm text-cyan-600 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col gap-5 rounded-xl border p-6 transition shadow-sm hover:shadow-md md:flex-row md:items-start md:justify-between"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{project.icon || "💼"}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {project.title}
                        </h3>
                        {project.tech && (
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {project.tech.split(/[,+/]/).map((t, idx) => {
                              const clean = t.trim();
                              if (!clean) return null;
                              return (
                                <span
                                  key={idx}
                                  className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium"
                                  style={{
                                    backgroundColor: `${getThemeColor()}15`,
                                    color: getThemeColor(),
                                    border: `1px solid ${getThemeColor()}30`,
                                  }}
                                >
                                  {clean}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
                    {project.demo && project.demo !== '#' && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition hover:shadow-sm"
                        style={{
                          backgroundColor: '#dcfce7',
                          color: '#16a34a',
                        }}
                      >
                        🌐 Live Demo
                      </a>
                    )}

                    {project.github && project.github !== '#' && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition hover:shadow-sm"
                        style={{
                          backgroundColor: '#e0e7ff',
                          color: '#4f46e5',
                        }}
                      >
                        💻 GitHub
                      </a>
                    )}

                    <button
                      onClick={() => editProject(project)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition hover:shadow-sm"
                      style={{
                        backgroundColor: '#dbeafe',
                        color: '#2563eb',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#bfdbfe';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#dbeafe';
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => deleteProject(project.id)}
                      disabled={deletingId === project.id}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:opacity-50 hover:shadow-sm"
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fecaca';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fee2e2';
                      }}
                    >
                      {deletingId === project.id ? (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                      ) : (
                        "🗑️ Delete"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}