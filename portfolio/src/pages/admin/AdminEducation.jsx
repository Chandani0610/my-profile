// pages/admin/AdminEducation.jsx
import { useEffect, useState } from "react";
import { 
  GraduationCap, 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Calendar,
  Building2,
  Award
} from "lucide-react";

import API from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";

const emptyEducation = {
  degree: "",
  college: "",
  marks: "",
  year: "",
};

export default function AdminEducation() {
  const { currentTheme } = useTheme();

  const [educationList, setEducationList] = useState([]);
  const [form, setForm] = useState(emptyEducation);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const loadEducation = async () => {
    try {
      setLoading(true);
      let list = [];
      try {
        const res = await API.get("/admin/education");
        if (res.data?.success && Array.isArray(res.data.data)) {
          list = res.data.data;
        }
      } catch {
        // fallback
      }

      if (list.length === 0) {
        try {
          const pRes = await API.get("/portfolio");
          if (pRes.data?.success && Array.isArray(pRes.data.data?.education)) {
            list = pRes.data.data.education;
          }
        } catch {
          // fallback
        }
      }

      setEducationList(list);
    } catch (err) {
      console.error("Load education error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEducation();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.degree.trim() || !form.college.trim()) {
      showToast("Please provide degree and college name", "error");
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await API.put("/admin/education/" + editingId, form);
        showToast("Education record updated successfully!", "success");
      } else {
        await API.post("/admin/education", form);
        showToast("Education record added successfully!", "success");
      }

      setForm(emptyEducation);
      setEditingId(null);
      await loadEducation();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to save education record", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      degree: item.degree || "",
      college: item.college || item.institution || "",
      marks: item.marks || item.score || "",
      year: item.year || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm("Are you sure you want to delete \"" + (title || "this record") + "\"?")) {
      return;
    }

    try {
      setDeletingId(id);
      await API.delete("/admin/education/" + id);
      showToast("Education record deleted.", "success");
      await loadEducation();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to delete record.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyEducation);
  };

  const filteredEducation = educationList.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (item.degree || "").toLowerCase().includes(term) ||
      (item.college || item.institution || "").toLowerCase().includes(term) ||
      (item.year || "").toLowerCase().includes(term)
    );
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
              <span>Academic Background</span>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold text-white">
              Education Manager
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage degrees, colleges, scores, and completion timelines featured on your portfolio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadEducation}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <RefreshCw className={"h-3.5 w-3.5 " + (loading ? "animate-spin" : "")} />
              <span>Refresh</span>
            </button>

            <a
              href="/#education"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-950/40 px-3.5 py-2 text-xs font-semibold text-purple-300 transition hover:bg-purple-900/50"
            >
              <span>View On Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Status Notification Toast */}
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
          {/* LEFT: Education Form (5 cols) */}
          <div className="lg:col-span-5">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-800 bg-slate-900/90 p-7 shadow-xl space-y-5 sticky top-8"
            >
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {editingId ? <Pencil className="h-4 w-4 text-purple-400" /> : <Plus className="h-4 w-4 text-purple-400" />}
                    <span>{editingId ? "Edit Academic Record" : "Add Education Record"}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {editingId ? "Update details and save" : "Enter degree & institution details"}
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

              {/* Degree */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Degree / Program *
                </label>
                <input
                  type="text"
                  name="degree"
                  required
                  placeholder="e.g. B.Tech in Computer Science"
                  value={form.degree}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                />
              </div>

              {/* College / Institution */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  College / University / School *
                </label>
                <input
                  type="text"
                  name="college"
                  required
                  placeholder="e.g. IES College of Technology"
                  value={form.college}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                />
              </div>

              {/* Marks / CGPA & Year */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Score / CGPA / %
                  </label>
                  <input
                    type="text"
                    name="marks"
                    placeholder="e.g. 8.36 CGPA or 71.2%"
                    value={form.marks}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Year / Timeline
                  </label>
                  <input
                    type="text"
                    name="year"
                    placeholder="e.g. 2022 - 2026"
                    value={form.year}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
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
                      <span>Saving Record...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>{editingId ? "Update Education" : "Add Education Record"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Education Timeline Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search & Counter toolbar */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search education by degree, college, or year..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                />
              </div>

              <span className="shrink-0 text-xs font-bold text-purple-300 px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/30">
                {filteredEducation.length} Records
              </span>
            </div>

            {/* Records List */}
            {filteredEducation.length === 0 ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center">
                <GraduationCap className="mx-auto h-12 w-12 text-slate-600" />
                <h3 className="mt-3 text-sm font-bold text-white">No education records found</h3>
                <p className="mt-1 text-xs text-slate-400">Add an academic milestone using the form on the left.</p>
              </div>
            ) : (
              filteredEducation.map((item, idx) => {
                const isEditing = editingId === item.id;
                const isDeleting = deletingId === item.id;

                return (
                  <div
                    key={item.id || idx}
                    className={"group relative rounded-3xl border p-6 transition-all duration-200 bg-slate-900/90 shadow-xl " + (
                      isEditing ? "border-purple-500 ring-2 ring-purple-500/20" : "border-slate-800 hover:border-slate-700"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 shadow-md">
                          <GraduationCap className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white flex items-center gap-2">
                            <span>{item.degree}</span>
                            {isEditing && (
                              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold border border-purple-500/30">
                                Editing
                              </span>
                            )}
                          </h4>
                          <p className="mt-1 text-xs text-slate-300 font-medium flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            <span>{item.college || item.institution}</span>
                          </p>

                          <div className="mt-3 flex items-center gap-3 text-xs flex-wrap">
                            {(item.marks || item.score) && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                                <Award className="h-3 w-3" />
                                <span>{item.marks || item.score}</span>
                              </span>
                            )}
                            {item.year && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-[11px] text-slate-300">
                                <Calendar className="h-3 w-3 text-purple-400" />
                                <span>{item.year}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="rounded-xl border border-purple-500/30 bg-purple-950/30 p-2 text-purple-300 hover:bg-purple-900/50 transition"
                          title="Edit Education"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.degree)}
                          disabled={isDeleting}
                          className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-2 text-rose-400 hover:bg-rose-950/40 transition"
                          title="Delete Education"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
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
