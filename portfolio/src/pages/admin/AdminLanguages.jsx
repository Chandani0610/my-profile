import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";

const emptyLanguage = {
  name: "",
  level: "",
};

// Common language levels
const languageLevels = [
  "Native",
  "Fluent",
  "Professional",
  "Advanced",
  "Upper Intermediate",
  "Intermediate",
  "Lower Intermediate",
  "Beginner",
  "Elementary",
];

// Common languages suggestions
const languageSuggestions = [
  "English", "Spanish", "French", "German", "Chinese", "Japanese",
  "Korean", "Russian", "Arabic", "Portuguese", "Italian", "Dutch",
  "Hindi", "Bengali", "Urdu", "Tamil", "Telugu", "Marathi",
  "Gujarati", "Kannada", "Malayalam", "Odia", "Punjabi", "Nepali"
];

export default function AdminLanguages() {
  const navigate = useNavigate();
  const { themeColors, currentTheme } = useTheme();

  const [languages, setLanguages] = useState([]);
  const [form, setForm] = useState(emptyLanguage);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

    const loadLanguages = async () => {
      try {
        setLoading(true);
        const response = await API.get("/portfolio", {
          signal: abortController.signal
        });

        if (response.data.success) {
          setLanguages(response.data.data.languages || []);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Failed to load languages:", error);
          setMessage("❌ Failed to load languages.");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadLanguages();

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

    // Validate inputs
    if (!form.name.trim()) {
      setMessage("⚠️ Please enter a language name.");
      return;
    }

    if (!form.level.trim()) {
      setMessage("⚠️ Please select a proficiency level.");
      return;
    }

    // Check for duplicate language
    const isDuplicate = languages.some(
      (lang) => 
        lang.name.toLowerCase() === form.name.trim().toLowerCase() &&
        lang.id !== editingId
    );

    if (isDuplicate) {
      setMessage(`⚠️ "${form.name}" already exists in your languages.`);
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      if (editingId) {
        await API.put(`/admin/languages/${editingId}`, form);
        setMessage("✅ Language updated successfully.");
      } else {
        await API.post("/admin/languages", form);
        setMessage("✅ Language added successfully.");
      }

      setForm(emptyLanguage);
      setEditingId(null);
      setShowSuggestions(false);
      
      // Reload fresh data
      const response = await API.get("/portfolio");
      if (response.data.success) {
        setLanguages(response.data.data.languages || []);
      }

      // Auto-dismiss message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "❌ Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const editLanguage = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      level: item.level || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteLanguage = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this language?"
    );
    if (!confirmed) return;

    setDeletingId(id);
    setMessage("");

    try {
      await API.delete(`/admin/languages/${id}`);
      setMessage("✅ Language deleted successfully.");
      
      // Reload fresh data
      const response = await API.get("/portfolio");
      if (response.data.success) {
        setLanguages(response.data.data.languages || []);
      }

      // Auto-dismiss message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "❌ Failed to delete language."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyLanguage);
    setShowSuggestions(false);
  };

  const selectLanguage = (language) => {
    setForm({ ...form, name: language });
    setShowSuggestions(false);
  };

  // Sort languages alphabetically
  const sortedLanguages = [...languages].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  // Get level badge color for white cards
  const getLevelColor = (level) => {
    const levelMap = {
      'native': 'bg-emerald-100 text-emerald-700',
      'fluent': 'bg-green-100 text-green-700',
      'professional': 'bg-blue-100 text-blue-700',
      'advanced': 'bg-cyan-100 text-cyan-700',
      'upper intermediate': 'bg-sky-100 text-sky-700',
      'intermediate': 'bg-yellow-100 text-yellow-700',
      'lower intermediate': 'bg-orange-100 text-orange-700',
      'beginner': 'bg-red-100 text-red-700',
      'elementary': 'bg-red-100 text-red-700',
    };
    const key = level?.toLowerCase() || '';
    return levelMap[key] || 'bg-gray-100 text-gray-700';
  };

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
              ADMIN / LANGUAGES
            </p>
            <h1 className="mt-2 text-3xl font-bold">Manage Languages</h1>
            <p 
              className="mt-1 text-sm"
              style={{ color: themeColors?.textSecondary || '#94a3b8' }}
            >
              {languages.length} language{languages.length !== 1 ? 's' : ''} in your portfolio
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
            {editingId ? "✏️ Edit Language" : "➕ Add New Language"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Language <span className="text-cyan-400 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="English"
                    required
                    className="flex-1 rounded-xl border px-4 py-3 outline-none transition placeholder:text-gray-400 focus:ring-2"
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
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="rounded-xl border px-4 py-3 text-sm transition hover:bg-gray-100"
                    style={{
                      borderColor: '#d1d5db',
                      backgroundColor: '#ffffff',
                      color: '#6b7280',
                    }}
                  >
                    📚
                  </button>
                </div>

                {showSuggestions && (
                  <div className="absolute z-10 mt-2 max-h-48 w-full overflow-y-auto rounded-xl border bg-white p-3 shadow-xl"
                    style={{
                      borderColor: '#d1d5db',
                    }}
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {languageSuggestions.map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => selectLanguage(lang)}
                          className="rounded-lg p-2 text-sm text-left text-gray-700 transition hover:bg-gray-100"
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Proficiency Level <span className="text-cyan-400 ml-1">*</span>
              </label>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                required
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
                <option value="" className="text-gray-400">
                  Select a level...
                </option>
                {languageLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
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
                  editingId ? "Update Language" : "Add Language"
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
              Languages are displayed on the portfolio's Languages section. Click the 📚 button for language suggestions.
            </p>
          </div>
        </div>

        {/* LANGUAGES LIST - WHITE CARDS WITH DARK TEXT */}
        <div 
          className="rounded-2xl border p-6"
          style={{
            borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
            backgroundColor: themeColors?.cardBg || 'rgba(255,255,255,0.05)',
          }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Languages</h2>
            {!loading && languages.length > 0 && (
              <span 
                className="rounded-full px-3 py-1 text-xs"
                style={{
                  backgroundColor: `${getThemeColor()}20`,
                  color: getThemeColor(),
                }}
              >
                {languages.length} total
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
                <p className="text-white/50">Loading languages...</p>
              </div>
            </div>
          ) : languages.length === 0 ? (
            <div 
              className="rounded-xl border p-8 text-center"
              style={{
                borderColor: '#d1d5db',
                backgroundColor: '#ffffff',
              }}
            >
              <p className="text-gray-500">No languages found. Add your first language above!</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedLanguages.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col gap-2 rounded-xl border p-5 transition shadow-sm hover:shadow-md"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${getLevelColor(item.level)}`}>
                        {item.level}
                      </span>
                    </div>
                    <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => editLanguage(item)}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium transition"
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
                        onClick={() => deleteLanguage(item.id)}
                        disabled={deletingId === item.id}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:opacity-50"
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
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}