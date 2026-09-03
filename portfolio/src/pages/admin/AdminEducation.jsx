import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";

const emptyEducation = {
  degree: "",
  institution: "",
  year: "",
  score: "",
};

export default function AdminEducation() {
  const navigate = useNavigate();
  const { themeColors, currentTheme } = useTheme();

  const [education, setEducation] = useState([]);
  const [form, setForm] = useState(emptyEducation);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

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

  // ✅ Updated useEffect with AbortController for cleanup
  useEffect(() => {
    const abortController = new AbortController();

    const loadEducation = async () => {
      try {
        setLoading(true);
        const response = await API.get("/portfolio", {
          signal: abortController.signal
        });

        if (response.data.success) {
          // Ensure each education entry has an ID
          const eduData = (response.data.data.education || []).map(item => ({
            ...item,
            id: item.id || `edu-${Date.now()}-${Math.random()}`
          }));
          setEducation(eduData);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Failed to load education:", error);
          setMessage("❌ Failed to load education.");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadEducation();

    return () => {
      abortController.abort();
    };
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

    // Validate year format
    if (!form.year.trim()) {
      setMessage("⚠️ Please enter the year.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      if (editingId) {
        await API.put(`/admin/education/${editingId}`, form);
        setMessage("✅ Education updated successfully.");
      } else {
        await API.post("/admin/education", form);
        setMessage("✅ Education added successfully.");
      }

      setForm(emptyEducation);
      setEditingId(null);
      
      // Reload fresh data
      const response = await API.get("/portfolio");
      if (response.data.success) {
        const eduData = (response.data.data.education || []).map(item => ({
          ...item,
          id: item.id || `edu-${Date.now()}-${Math.random()}`
        }));
        setEducation(eduData);
      }

      // Auto-dismiss message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Submit error:", error);
      setMessage(
        error.response?.data?.message || "❌ Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const editEducation = (item) => {
    if (!item || !item.id) {
      setMessage("❌ Cannot edit: Invalid education data");
      return;
    }
    
    setEditingId(item.id);
    setForm({
      degree: item.degree || "",
      institution: item.institution || "",
      year: item.year || "",
      score: item.score || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteEducation = async (id) => {
    if (!id) {
      setMessage("❌ Cannot delete: Invalid education ID");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this education entry?"
    );
    if (!confirmed) return;

    setDeletingId(id);
    setMessage("");

    try {
      await API.delete(`/admin/education/${id}`);
      setMessage("✅ Education deleted successfully.");
      
      // Reload fresh data
      const response = await API.get("/portfolio");
      if (response.data.success) {
        const eduData = (response.data.data.education || []).map(item => ({
          ...item,
          id: item.id || `edu-${Date.now()}-${Math.random()}`
        }));
        setEducation(eduData);
      }

      // Auto-dismiss message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Delete error:", error);
      setMessage(
        error.response?.data?.message || "❌ Failed to delete education."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyEducation);
  };

  // Sort education by year (newest first)
  const sortedEducation = [...education].sort((a, b) => {
    // Extract start year from "2020 - 2024" format
    const getStartYear = (yearStr) => {
      const match = yearStr?.match(/\d{4}/);
      return match ? parseInt(match[0]) : 0;
    };
    return getStartYear(b.year) - getStartYear(a.year);
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
              ADMIN / EDUCATION
            </p>
            <h1 className="mt-2 text-3xl font-bold">Manage Education</h1>
            <p 
              className="mt-1 text-sm"
              style={{ color: themeColors?.textSecondary || '#94a3b8' }}
            >
              {education.length} education entr{education.length !== 1 ? 'ies' : 'y'} in your portfolio
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
          <h2 className="mb-6 text-xl font-semibold">
            {editingId ? "✏️ Edit Education" : "➕ Add New Education"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Degree <span className="text-cyan-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="degree"
                value={form.degree}
                onChange={handleChange}
                placeholder="B.Sc. Computer Science"
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
                Institution <span className="text-cyan-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="institution"
                value={form.institution}
                onChange={handleChange}
                placeholder="University of Example"
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
                Year <span className="text-cyan-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="2020 - 2024"
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
                Score/GPA <span className="text-cyan-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="score"
                value={form.score}
                onChange={handleChange}
                placeholder="3.8/4.0"
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
                {saving ? (
                  <>
                    <span className="inline-block h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {editingId ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingId ? "Update Education" : "Add Education"
                )}
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

          <div className="mt-4 border-t pt-4" style={{ borderColor: themeColors?.border || 'rgba(255,255,255,0.05)' }}>
            <p className="text-xs" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.2)' }}>
              Education entries are displayed on the portfolio's Education section in chronological order.
            </p>
          </div>
        </div>

        {/* EDUCATION LIST - WHITE CARDS WITH DARK TEXT */}
        <div 
          className="rounded-2xl border p-6"
          style={{
            borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
            backgroundColor: themeColors?.cardBg || 'rgba(255,255,255,0.05)',
          }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Education</h2>
            {!loading && education.length > 0 && (
              <span 
                className="rounded-full px-3 py-1 text-xs"
                style={{
                  backgroundColor: `${getThemeColor()}20`,
                  color: getThemeColor(),
                }}
              >
                {education.length} total
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
                <p className="text-white/50">Loading education...</p>
              </div>
            </div>
          ) : education.length === 0 ? (
            <div 
              className="rounded-xl border p-8 text-center"
              style={{
                borderColor: '#d1d5db',
                backgroundColor: '#ffffff',
              }}
            >
              <p className="text-gray-500">No education entries found. Add your first education above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedEducation.map((item) => (
                <div
                  key={item.id || item.degree + item.year} // ✅ Fallback key
                  className="flex flex-col gap-4 rounded-xl border p-5 transition shadow-sm hover:shadow-md md:flex-row md:items-center md:justify-between"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                  }}
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.degree}</h3>
                    <p className="mt-1 text-sm" style={{ color: getThemeColor() }}>
                      {item.institution || item.college} {/* ✅ Support both field names */}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span>📅 {item.year}</span>
                      {item.score && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span>🎯 {item.score}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => editEducation(item)}
                      className="rounded-lg px-4 py-2 text-sm font-medium transition"
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
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEducation(item.id)}
                      disabled={deletingId === item.id}
                      className="rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50"
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
                      {deletingId === item.id ? (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                      ) : (
                        "Delete"
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