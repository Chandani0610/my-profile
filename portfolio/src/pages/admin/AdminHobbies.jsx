import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";

const emptyHobby = {
  name: "",
  icon: "",
};

// Common icon suggestions
const iconSuggestions = [
  "📷", "🎨", "🎵", "🎮", "📚", "🏀", "⚽", "🎾", "🏊", "🚴",
  "🎸", "🎹", "🎭", "🎪", "🎯", "🎱", "🎳", "🧘", "🏃", "⛰️",
  "🌊", "🌺", "🍳", "✈️", "🚀", "💻", "🎧", "🎤", "🎬", "🎮"
];

export default function AdminHobbies() {
  const navigate = useNavigate();
  const { themeColors, currentTheme } = useTheme();

  const [hobbies, setHobbies] = useState([]);
  const [form, setForm] = useState(emptyHobby);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

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

  // ✅ Load hobbies with better error handling
  // ✅ Load hobbies using /admin/hobbies with fallback
  const fetchHobbiesList = async (signal) => {
    let list = [];
    try {
      setError(null);
      const response = await API.get("/admin/hobbies", signal ? { signal } : undefined);
      if (response.data?.success) {
        const raw = response.data.data;
        list = Array.isArray(raw) ? raw : (raw?.hobbies || []);
      }
    } catch {
      try {
        const response = await API.get("/portfolio", signal ? { signal } : undefined);
        if (response.data?.success) {
          list = response.data.data?.hobbies || [];
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Failed to load hobbies:", err);
        }
      }
    }

    const normalized = list.map(item => ({
      id: item.id,
      name: item.hobby_name || item.name || "",
      hobby_name: item.hobby_name || item.name || "",
      icon: item.icon || "🎯",
    })).filter(item => item.name);

    if (normalized.length > 0) {
      setHobbies(normalized);
    } else {
      setHobbies([
        { id: 1, name: "Painting", hobby_name: "Painting", icon: "🎨" },
        { id: 2, name: "Listening to Music", hobby_name: "Listening to Music", icon: "🎵" },
      ]);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();

    const loadHobbies = async () => {
      setLoading(true);
      await fetchHobbiesList(abortController.signal);
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    };

    loadHobbies();

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

    if (!form.name.trim()) {
      setMessage("⚠️ Please enter a hobby name.");
      return;
    }

    if (!form.icon.trim()) {
      setMessage("⚠️ Please enter an icon for your hobby.");
      return;
    }

    const isDuplicate = hobbies.some(
      (hobby) => 
        (hobby.name || hobby.hobby_name || "").toLowerCase() === form.name.trim().toLowerCase() &&
        hobby.id !== editingId
    );

    if (isDuplicate) {
      setMessage(`⚠️ "${form.name}" already exists in your hobbies.`);
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const payload = {
        hobby_name: form.name.trim(),
        name: form.name.trim(),
        icon: form.icon.trim() || "🎯",
      };

      if (editingId) {
        await API.put(`/admin/hobbies/${editingId}`, payload);
        setMessage("✅ Hobby updated successfully.");
      } else {
        await API.post("/admin/hobbies", payload);
        setMessage("✅ Hobby added successfully.");
      }

      setForm(emptyHobby);
      setEditingId(null);
      setShowSuggestions(false);
      
      // Reload fresh data from /admin/hobbies
      await fetchHobbiesList();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ Submit error:", error);
      setMessage(
        error.response?.data?.message || "❌ Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const editHobby = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.hobby_name || item.name || "",
      icon: item.icon || "🎯",
    });
    setShowSuggestions(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteHobby = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hobby?"
    );
    if (!confirmed) return;

    setDeletingId(id);
    setMessage("");

    try {
      await API.delete(`/admin/hobbies/${id}`);
      setMessage("✅ Hobby deleted successfully.");
      
      // Reload fresh data from /admin/hobbies
      await fetchHobbiesList();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ Delete error:", error);
      setMessage(
        error.response?.data?.message || "❌ Failed to delete hobby."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyHobby);
    setShowSuggestions(false);
  };

  const selectIcon = (icon) => {
    setForm({ ...form, icon });
    setShowSuggestions(false);
  };

  const sortedHobbies = [...hobbies]
    .filter(hobby => hobby && hobby.name)
    .sort((a, b) => a.name.localeCompare(b.name));

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
              ADMIN / HOBBIES
            </p>
            <h1 className="mt-2 text-3xl font-bold">Manage Hobbies</h1>
            <p 
              className="mt-1 text-sm"
              style={{ color: themeColors?.textSecondary || '#94a3b8' }}
            >
              {hobbies.length} hobby{hobbies.length !== 1 ? 's' : ''} in your portfolio
            </p>
            {error && (
              <p className="mt-2 text-sm text-red-400">
                ⚠️ {error}
              </p>
            )}
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
                : "border-red-400/20 bg-red-400/10 text-red-300"
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
            {editingId ? "✏️ Edit Hobby" : "➕ Add New Hobby"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Hobby Name <span className="text-cyan-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Photography"
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
                Icon <span className="text-cyan-400 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="icon"
                    value={form.icon}
                    onChange={handleChange}
                    placeholder="📷"
                    required
                    className="flex-1 rounded-xl border px-4 py-3 text-2xl outline-none transition placeholder:text-gray-400 focus:ring-2"
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
                    😊
                  </button>
                </div>

                {showSuggestions && (
                  <div className="absolute z-10 mt-2 max-h-48 w-full overflow-y-auto rounded-xl border bg-white p-3 shadow-xl"
                    style={{
                      borderColor: '#d1d5db',
                    }}
                  >
                    <div className="grid grid-cols-8 gap-2">
                      {iconSuggestions.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => selectIcon(icon)}
                          className="rounded-lg p-2 text-2xl transition hover:bg-gray-100 hover:scale-110"
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
                  editingId ? "Update Hobby" : "Add Hobby"
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
              💡 Hobbies are displayed on the portfolio's Hobbies section. Click the 😊 button to choose from common icons.
            </p>
          </div>
        </div>

        {/* HOBBIES LIST - WHITE CARDS WITH DARK TEXT */}
        <div 
          className="rounded-2xl border p-6"
          style={{
            borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
            backgroundColor: themeColors?.cardBg || 'rgba(255,255,255,0.05)',
          }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Hobbies</h2>
            {!loading && hobbies.length > 0 && (
              <span 
                className="rounded-full px-3 py-1 text-xs"
                style={{
                  backgroundColor: `${getThemeColor()}20`,
                  color: getThemeColor(),
                }}
              >
                {hobbies.length} total
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
                <p className="text-white/50">Loading hobbies...</p>
              </div>
            </div>
          ) : hobbies.length === 0 ? (
            <div 
              className="rounded-xl border p-8 text-center"
              style={{
                borderColor: '#d1d5db',
                backgroundColor: '#ffffff',
              }}
            >
              <p className="text-gray-500">No hobbies found. Add your first hobby above!</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {sortedHobbies.map((item) => (
                <div
                  key={item.id || item.name}
                  className="group flex items-center gap-4 rounded-xl border px-6 py-4 transition shadow-sm hover:shadow-md"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                  }}
                >
                  <span className="text-3xl">{item.icon || "🎯"}</span>
                  <span className="text-lg font-semibold text-gray-900">{item.name}</span>
                  <div className="ml-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => editHobby(item)}
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
                      onClick={() => deleteHobby(item.id)}
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
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}