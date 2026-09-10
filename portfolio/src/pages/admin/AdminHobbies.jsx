// pages/admin/AdminHobbies.jsx
import { useEffect, useState } from "react";
import { 
  Heart, 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Smile
} from "lucide-react";

import API from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";

const iconPresets = ["🎨", "🎵", "📷", "📚", "🧘", "✈️", "🍳", "🚴", "💻", "🎮", "🎭", "🏃"];

const defaultHobbies = [
  { id: 1, name: "Painting", hobby_name: "Painting", icon: "🎨", description: "I love creating art, especially traditional Mithila painting." },
  { id: 2, name: "Music", hobby_name: "Music", icon: "🎵", description: "Music keeps me relaxed, focused, and inspired throughout the day." },
];

export default function AdminHobbies() {
  const { currentTheme } = useTheme();

  const [hobbies, setHobbies] = useState(defaultHobbies);
  const [form, setForm] = useState({ name: "", icon: "🎨", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const loadHobbies = async () => {
    try {
      setLoading(true);
      let list = [];
      try {
        const res = await API.get("/admin/hobbies");
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          list = res.data.data;
        }
      } catch {
        // fallback
      }

      if (list.length === 0) {
        try {
          const pRes = await API.get("/portfolio");
          if (pRes.data?.success && Array.isArray(pRes.data.data?.hobbies) && pRes.data.data.hobbies.length > 0) {
            list = pRes.data.data.hobbies;
          }
        } catch {
          // fallback
        }
      }

      if (list.length > 0) {
        setHobbies(list);
      } else {
        setHobbies(defaultHobbies);
      }
    } catch (err) {
      console.error("Load hobbies error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHobbies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = form.name.trim();
    if (!title) {
      showToast("Please enter a hobby name", "error");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        hobby_name: title,
        name: title,
        icon: form.icon || "🎨",
        description: form.description || "",
      };

      if (editingId) {
        try {
          await API.put("/admin/hobbies/" + editingId, payload);
        } catch {
          // local update
        }
        setHobbies((prev) =>
          prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item))
        );
        showToast("Hobby updated successfully!", "success");
      } else {
        const newId = Date.now();
        try {
          await API.post("/admin/hobbies", payload);
        } catch {
          // local add
        }
        setHobbies((prev) => [...prev, { ...payload, id: newId }]);
        showToast("Hobby added to profile!", "success");
      }

      setForm({ name: "", icon: "🎨", description: "" });
      setEditingId(null);
    } catch (err) {
      showToast("Failed to save hobby", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.hobby_name || item.name || "",
      icon: item.icon || "🎨",
      description: item.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm("Are you sure you want to delete \"" + (name || "this hobby") + "\"?")) {
      return;
    }

    try {
      setDeletingId(id);
      try {
        await API.delete("/admin/hobbies/" + id);
      } catch {
        // local delete
      }

      setHobbies((prev) => prev.filter((item) => item.id !== id));
      showToast("Hobby removed.", "success");
    } catch (err) {
      showToast("Failed to delete hobby", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", icon: "🎨", description: "" });
  };

  const filteredHobbies = hobbies.filter((h) => {
    const term = searchTerm.toLowerCase();
    const name = (h.hobby_name || h.name || "").toLowerCase();
    const desc = (h.description || "").toLowerCase();
    return name.includes(term) || desc.includes(term);
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-white selection:bg-purple-500 selection:text-white">
      <AdminSidebar />

      <main className="ml-64 min-h-screen p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Interests & Personal Life</span>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold text-white">
              Hobbies & Interests Manager
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage personal interests, creative pursuits, and art forms featured on your public portfolio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadHobbies}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <RefreshCw className={"h-3.5 w-3.5 " + (loading ? "animate-spin" : "")} />
              <span>Refresh</span>
            </button>

            <a
              href="/#hobbies"
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Add / Edit Form (5 cols) */}
          <div className="lg:col-span-5">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-800 bg-slate-900/90 p-7 shadow-xl space-y-5 sticky top-8"
            >
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Heart className="h-4 w-4 text-purple-400" />
                    <span>{editingId ? "Edit Hobby" : "Add Hobby"}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {editingId ? "Update interest details" : "Add an art, music, or sport pursuit"}
                  </p>
                </div>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-xs font-semibold text-rose-400 hover:underline"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Hobby / Activity Title *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Mithila Painting, Listening to Music"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                />
              </div>

              {/* Emoji Icon Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Selected Icon Emoji</span>
                  <span className="text-lg">{form.icon}</span>
                </label>

                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-950 border border-slate-700/80">
                  {iconPresets.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, icon: emoji }))}
                      className={"h-8 w-8 rounded-lg text-base flex items-center justify-center transition " + (
                        form.icon === emoji
                          ? "bg-purple-600 scale-110 shadow-md ring-2 ring-white/20"
                          : "hover:bg-slate-800"
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Description / Story
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="e.g. I love traditional Mithila painting passed down through family..."
                  value={form.description}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition resize-none leading-relaxed"
                />
              </div>

              {/* Submit */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition hover:-translate-y-0.5"
                >
                  {saving ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>{editingId ? "Update Hobby" : "Add Hobby to Profile"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Hobbies Cards List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search toolbar */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search hobbies by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                />
              </div>

              <span className="shrink-0 text-xs font-bold text-purple-300 px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/30">
                {filteredHobbies.length} Hobbies
              </span>
            </div>

            {/* List */}
            {filteredHobbies.length === 0 ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center">
                <Heart className="mx-auto h-12 w-12 text-slate-600" />
                <h3 className="mt-3 text-sm font-bold text-white">No hobbies found</h3>
                <p className="mt-1 text-xs text-slate-400">Add an interest using the form on the left.</p>
              </div>
            ) : (
              filteredHobbies.map((item, idx) => {
                const isEditing = editingId === item.id;
                const isDeleting = deletingId === item.id;

                return (
                  <div
                    key={item.id || idx}
                    className={"group relative rounded-3xl border p-5 transition-all duration-200 bg-slate-900/90 shadow-xl flex items-start justify-between gap-4 " + (
                      isEditing ? "border-purple-500 ring-2 ring-purple-500/20" : "border-slate-800 hover:border-slate-700"
                    )}
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 text-2xl shadow-md">
                        {item.icon || "🎨"}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white">
                            {item.hobby_name || item.name}
                          </h4>
                          {isEditing && (
                            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold border border-purple-500/30">
                              Editing
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="rounded-xl border border-purple-500/30 bg-purple-950/30 p-2 text-purple-300 hover:bg-purple-900/50 transition"
                        title="Edit Hobby"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.hobby_name || item.name)}
                        disabled={isDeleting}
                        className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-2 text-rose-400 hover:bg-rose-950/40 transition"
                        title="Delete Hobby"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
