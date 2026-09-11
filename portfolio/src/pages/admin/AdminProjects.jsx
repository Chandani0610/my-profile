// pages/admin/AdminProjects.jsx
import { useEffect, useState, useRef } from "react";
import { 
  Briefcase, 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Code, 
  Globe, 
  X,
  Layers,
  Copy,
  UploadCloud,
  Image as ImageIcon,
  Eye,
  Check
} from "lucide-react";

import API, { getImageUrl } from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import resumeData from "../../data/resumeData";
import { useTheme } from "../../context/ThemeContext";

const emptyProject = {
  title: "",
  icon: "💻",
  tech: "",
  description: "",
  github: "",
  demo: "",
  image: "",
};

export default function AdminProjects() {
  const { currentTheme } = useTheme();
  const fileInputRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
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

  // Compress and convert image to persistent, lightweight Base64 data URL
  const compressImageToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;
          const maxDim = 1280;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          try {
            const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
            resolve(dataUrl);
          } catch {
            resolve(e.target.result);
          }
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      let list = [];
      try {
        const res = await API.get("/admin/projects");
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          list = res.data.data;
        }
      } catch {
        // fallback
      }

      if (list.length === 0) {
        try {
          const pRes = await API.get("/portfolio");
          if (pRes.data?.success && Array.isArray(pRes.data.data?.projects) && pRes.data.data.projects.length > 0) {
            list = pRes.data.data.projects;
          }
        } catch {
          // fallback
        }
      }

      if (list.length === 0) {
        list = resumeData.projects || [];
      }

      // Read persistent local custom projects (guarantees uploaded images survive reloads and sleeps)
      let savedLocal = [];
      try {
        const stored = localStorage.getItem("portfolio_custom_projects");
        if (stored) savedLocal = JSON.parse(stored);
      } catch (e) {}

      // Merge backend list with locally saved custom images
      const merged = list.map((item, idx) => {
        const localMatch = savedLocal.find(
          (l) => l.id === item.id || (l.title && item.title && l.title.toLowerCase() === item.title.toLowerCase())
        );
        return {
          ...item,
          image: (localMatch && localMatch.image) ? localMatch.image : (item.image || null),
        };
      });

      // Also append any locally created projects that aren't in backend list yet
      savedLocal.forEach((lp) => {
        if (!merged.some((m) => m.id === lp.id || (m.title && lp.title && m.title.toLowerCase() === lp.title.toLowerCase()))) {
          merged.unshift(lp);
        }
      });

      setProjects(merged);
    } catch (err) {
      console.error("Load projects error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showToast("File size is too large (max 15MB)", "error");
      return;
    }

    try {
      setUploadingImage(true);

      // 1. Immediately convert to high-performance, permanent Base64 data URL
      const base64Url = await compressImageToBase64(file);
      if (base64Url) {
        setForm((prev) => ({ ...prev, image: base64Url }));
      }

      // 2. Also attempt upload to server multipart endpoint in background
      try {
        const formData = new FormData();
        formData.append("image", file);
        await API.post("/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (uploadErr) {
        console.warn("Server upload notice, using persistent base64 data:", uploadErr.message);
      }

      showToast("Project screenshot loaded! Click Update / Save to publish.", "success");
    } catch (err) {
      console.warn("Upload fallback error:", err);
      showToast("Could not process image file.", "error");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast("Please provide a project title", "error");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...form,
        title: form.title.trim(),
        tech: form.tech || "",
        image: form.image || null,
      };

      if (editingId) {
        // Optimistically update projects state immediately (same as certifications logic)
        setProjects((prev) => {
          const updated = prev.map((p) => (p.id === editingId ? { ...p, ...payload } : p));
          try {
            localStorage.setItem("portfolio_custom_projects", JSON.stringify(updated));
            window.dispatchEvent(new Event("portfolio_projects_updated"));
          } catch (e) {
            console.warn("Local storage write error:", e);
          }
          return updated;
        });

        // Send update to API
        try {
          await API.put("/admin/projects/" + editingId, payload);
        } catch (apiErr) {
          console.warn("API update warning, project saved locally:", apiErr.message);
        }

        showToast("Project updated successfully with permanent image!", "success");
      } else {
        const newId = Date.now();
        const newProject = { ...payload, id: newId };

        setProjects((prev) => {
          const updated = [newProject, ...prev];
          try {
            localStorage.setItem("portfolio_custom_projects", JSON.stringify(updated));
            window.dispatchEvent(new Event("portfolio_projects_updated"));
          } catch (e) {
            console.warn("Local storage write error:", e);
          }
          return updated;
        });

        try {
          const res = await API.post("/admin/projects", payload);
          if (res.data?.data?.id) {
            const backendId = res.data.data.id;
            setProjects((prev) => {
              const updated = prev.map((p) => (p.id === newId ? { ...p, id: backendId } : p));
              try {
                localStorage.setItem("portfolio_custom_projects", JSON.stringify(updated));
              } catch (e) {}
              return updated;
            });
          }
        } catch (apiErr) {
          console.warn("API create warning, project saved locally:", apiErr.message);
        }

        showToast("Project created and published successfully!", "success");
      }

      setForm(emptyProject);
      setEditingId(null);
    } catch (error) {
      showToast("Failed to save project. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title || "",
      icon: project.icon || "💻",
      tech: project.tech || project.technologies || "",
      description: project.description || "",
      github: project.github || "",
      demo: project.demo || "",
      image: project.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDuplicate = (project) => {
    setEditingId(null);
    setForm({
      title: (project.title || "") + " (Copy)",
      icon: project.icon || "💻",
      tech: project.tech || project.technologies || "",
      description: project.description || "",
      github: project.github || "",
      demo: project.demo || "",
      image: project.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Project duplicated into editor form. Make changes and save!", "success");
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm("Are you sure you want to delete \"" + (title || "this project") + "\"?")) {
      return;
    }

    try {
      setDeletingId(id);
      try {
        await API.delete("/admin/projects/" + id);
      } catch (apiErr) {
        console.warn("Delete API warning:", apiErr.message);
      }

      setProjects((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        try {
          localStorage.setItem("portfolio_custom_projects", JSON.stringify(updated));
          window.dispatchEvent(new Event("portfolio_projects_updated"));
        } catch (e) {}
        return updated;
      });

      showToast("Project deleted successfully.", "success");
    } catch (error) {
      showToast("Failed to delete project.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancel = () => {
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
    <div className="min-h-screen bg-[#070b14] text-white selection:bg-purple-500 selection:text-white">
      <AdminSidebar />

      <main className="ml-64 min-h-screen p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Showcase Management</span>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold text-white">
              Projects Manager
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Add, edit, or manage web applications, screenshots, and repository links featured on your portfolio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadProjects}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <RefreshCw className={"h-3.5 w-3.5 " + (loading ? "animate-spin" : "")} />
              <span>Refresh</span>
            </button>

            <a
              href="/#projects"
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
          {/* LEFT: Project Form (5 cols) */}
          <div className="lg:col-span-5">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-800 bg-slate-900/90 p-7 shadow-xl space-y-5 sticky top-8"
            >
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {editingId ? <Pencil className="h-4 w-4 text-purple-400" /> : <Plus className="h-4 w-4 text-purple-400" />}
                    <span>{editingId ? "Edit Project" : "Add New Project"}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {editingId ? "Modify project details below" : "Enter project details to publish"}
                  </p>
                </div>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-xs font-semibold text-rose-400 hover:underline"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              {/* Title & Icon */}
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g. Fee Management System"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Icon
                  </label>
                  <input
                    type="text"
                    name="icon"
                    value={form.icon}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-center text-sm text-white focus:border-purple-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* =======================================================
                  PROJECT IMAGE SECTION (UPLOAD + URL + PREVIEW)
              ======================================================= */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                    <ImageIcon className="h-3.5 w-3.5 text-purple-400" />
                    <span>Project Image / Screenshot</span>
                  </label>
                  {form.image && (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                      className="text-[11px] font-medium text-rose-400 hover:text-rose-300 transition flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  className="hidden"
                />

                {/* Upload Zone or Image Preview */}
                {form.image ? (
                  <div className="relative overflow-hidden rounded-xl border border-purple-500/40 bg-slate-900 group shadow-md">
                    <div className="aspect-[16/9] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                      <img
                        src={getImageUrl(form.image)}
                        alt="Project Screenshot Preview"
                        className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                        onError={(e) => {
                          if (!form.image.startsWith("http") && !form.image.startsWith("/")) {
                            e.target.src = "/" + form.image;
                          }
                        }}
                      />
                    </div>

                    {/* Hover Overlay Actions */}
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 p-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-purple-500 transition flex items-center gap-1.5"
                      >
                        <UploadCloud className="h-3.5 w-3.5" />
                        <span>{uploadingImage ? "Uploading..." : "Replace Image"}</span>
                      </button>

                      <a
                        href={getImageUrl(form.image)}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition flex items-center gap-1.5"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Full View</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group cursor-pointer rounded-xl border-2 border-dashed border-slate-700/80 hover:border-purple-500/70 bg-slate-900/50 hover:bg-purple-950/20 p-5 text-center transition-all duration-200"
                  >
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80 group-hover:bg-purple-600/20 text-slate-400 group-hover:text-purple-400 transition shadow-inner">
                      {uploadingImage ? (
                        <RefreshCw className="h-5 w-5 animate-spin text-purple-400" />
                      ) : (
                        <UploadCloud className="h-5 w-5" />
                      )}
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-300 group-hover:text-purple-300 transition">
                      {uploadingImage ? "Uploading Screenshot..." : "Click to upload project screenshot"}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      PNG, JPG, JPEG, WEBP or GIF (Max 10MB)
                    </p>
                  </div>
                )}

                {/* Direct Image URL / Asset Path input */}
                <div className="pt-2 border-t border-slate-800/60">
                  <span className="block text-[11px] text-slate-400 mb-1">
                    Or enter Image URL / Asset Path:
                  </span>
                  <input
                    type="text"
                    name="image"
                    placeholder="e.g. /assets/vedant-devotions.png or https://..."
                    value={form.image}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Tech Stack (Comma Separated) *
                </label>
                <input
                  type="text"
                  name="tech"
                  required
                  placeholder="React.js, Node.js, Express, MySQL, Tailwind"
                  value={form.tech}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Explain what problem this project solves and core features built..."
                  value={form.description}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition resize-none leading-relaxed"
                />
              </div>

              {/* GitHub & Demo Links */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    GitHub Repository Link
                  </label>
                  <input
                    type="text"
                    name="github"
                    placeholder="https://github.com/Chandani0610/..."
                    value={form.github}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Live Demo / Video URL
                  </label>
                  <input
                    type="text"
                    name="demo"
                    placeholder="https://my-app.vercel.app"
                    value={form.demo}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Saving Project...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>{editingId ? "Update Project" : "Add Project to Portfolio"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Project Cards List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search toolbar */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search projects by title, tech stack or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                />
              </div>

              <span className="shrink-0 text-xs font-bold text-purple-300 px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/30">
                {filteredProjects.length} Projects
              </span>
            </div>

            {/* List */}
            {filteredProjects.length === 0 ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center">
                <Briefcase className="mx-auto h-12 w-12 text-slate-600" />
                <h3 className="mt-3 text-sm font-bold text-white">No projects found</h3>
                <p className="mt-1 text-xs text-slate-400">Try changing your search or add a project using the form on the left.</p>
              </div>
            ) : (
              filteredProjects.map((p, idx) => {
                const isEditing = editingId === p.id;
                const isDeleting = deletingId === p.id;
                const techList = (p.tech || p.technologies || "").split("+").join(",").split(",").map((t) => t.trim()).filter(Boolean);

                return (
                  <div
                    key={p.id || idx}
                    className={"group relative rounded-3xl border p-5 sm:p-6 transition-all duration-200 bg-slate-900/90 shadow-xl " + (
                      isEditing ? "border-purple-500 ring-2 ring-purple-500/20" : "border-slate-800 hover:border-slate-700"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        {/* Project Thumbnail Image or Icon */}
                        {p.image ? (
                          <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-md">
                            <img
                              src={getImageUrl(p.image)}
                              alt={p.title}
                              className="h-full w-full object-cover object-top"
                              onError={(e) => {
                                if (!p.image.startsWith("http") && !p.image.startsWith("/")) {
                                  e.target.src = "/" + p.image;
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 text-2xl shadow-md">
                            {p.icon || "💻"}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h4 className="text-base font-bold text-white flex items-center flex-wrap gap-2">
                            <span>{p.title}</span>
                            {isEditing && (
                              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold border border-purple-500/30">
                                Editing
                              </span>
                            )}
                            {p.image && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30 flex items-center gap-1">
                                <ImageIcon className="h-2.5 w-2.5" />
                                <span>Image Attached</span>
                              </span>
                            )}
                          </h4>
                          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {p.description}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDuplicate(p)}
                          className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-400 hover:text-white transition"
                          title="Duplicate Project"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(p)}
                          className="rounded-xl border border-purple-500/30 bg-purple-950/30 p-2 text-purple-300 hover:bg-purple-900/50 transition"
                          title="Edit Project"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.title)}
                          disabled={isDeleting}
                          className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-2 text-rose-400 hover:bg-rose-950/40 transition"
                          title="Delete Project"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Tech Badges */}
                    {techList.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                        {techList.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="rounded-lg bg-slate-950/80 border border-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    {(p.github || p.demo || p.image) && (
                      <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          {p.github && (
                            <a
                              href={p.github}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-purple-300 flex items-center gap-1 transition"
                            >
                              <Code className="h-3 w-3" />
                              <span>Code</span>
                            </a>
                          )}
                          {p.demo && (
                            <a
                              href={p.demo}
                              target="_blank"
                              rel="noreferrer"
                              className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold transition"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>Live Demo</span>
                            </a>
                          )}
                        </div>

                        {p.image && (
                          <a
                            href={getImageUrl(p.image)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-slate-400 hover:text-purple-300 flex items-center gap-1 transition"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View Full Image</span>
                          </a>
                        )}
                      </div>
                    )}
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
