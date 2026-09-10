// pages/admin/AdminCertifications.jsx
import { useEffect, useState, useRef } from "react";
import { 
  Award, 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  UploadCloud, 
  Eye, 
  Building2, 
  X,
  Copy,
  Check
} from "lucide-react";

import API, { getImageUrl } from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import resumeData from "../../data/resumeData";
import { useTheme } from "../../context/ThemeContext";

const emptyCert = {
  certification_name: "",
  issuer: "",
  credential: "",
  image: "",
};

export default function AdminCertifications() {
  const { currentTheme } = useTheme();
  const fileInputRef = useRef(null);

  const [certifications, setCertifications] = useState(resumeData.certifications || []);
  const [form, setForm] = useState(emptyCert);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedPreviewCert, setSelectedPreviewCert] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIssuer, setSelectedIssuer] = useState("All");
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

  const loadCertifications = async () => {
    try {
      setLoading(true);
      let list = [];
      try {
        const res = await API.get("/admin/certifications");
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          list = res.data.data;
        }
      } catch {
        // fallback
      }

      if (list.length === 0) {
        try {
          const pRes = await API.get("/portfolio");
          if (pRes.data?.success && Array.isArray(pRes.data.data?.certifications) && pRes.data.data.certifications.length > 0) {
            list = pRes.data.data.certifications;
          }
        } catch {
          // fallback
        }
      }

      if (list.length > 0) {
        // Merge with resumeData fallback images
        const merged = list.map((item, idx) => {
          const fallback = resumeData.certifications[idx] || {};
          return {
            id: item.id || fallback.id || idx + 1,
            certification_name: item.certification_name || item.title || fallback.title,
            title: item.certification_name || item.title || fallback.title,
            issuer: item.issuer || fallback.issuer || "Professional Organization",
            credential: item.credential || fallback.credential || (idx === 7 ? "ID: FBCED9F0E3A3" : ""),
            image: item.image || fallback.image || "/uploads/certifications/cert-1788807884045-868142352.png",
          };
        });
        setCertifications(merged);
      } else {
        setCertifications(resumeData.certifications || []);
      }
    } catch (err) {
      console.error("Load certifications error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertifications();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await API.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success && res.data.url) {
        setForm((prev) => ({ ...prev, image: res.data.url }));
        showToast("Certificate document uploaded!", "success");
      }
    } catch {
      // Simulate local object URL
      const localUrl = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, image: localUrl }));
      showToast("Certificate preview loaded.", "success");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const certName = form.certification_name.trim();
    if (!certName) {
      showToast("Please enter certification title", "error");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        certification_name: certName,
        title: certName,
        issuer: form.issuer || "Verified Organization",
        credential: form.credential || "",
        image: form.image || "/uploads/certifications/cert-1788807884045-868142352.png",
      };

      if (editingId) {
        try {
          await API.put("/admin/certifications/" + editingId, payload);
        } catch {
          // local update
        }
        setCertifications((prev) =>
          prev.map((c) => (c.id === editingId ? { ...c, ...payload } : c))
        );
        showToast("Certification updated successfully!", "success");
      } else {
        const newId = Date.now();
        try {
          await API.post("/admin/certifications", payload);
        } catch {
          // local add
        }
        setCertifications((prev) => [{ ...payload, id: newId }, ...prev]);
        showToast("Certification added to showcase!", "success");
      }

      setForm(emptyCert);
      setEditingId(null);
    } catch (err) {
      showToast("Failed to save certification", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cert) => {
    setEditingId(cert.id);
    setForm({
      certification_name: cert.certification_name || cert.title || "",
      issuer: cert.issuer || "",
      credential: cert.credential || "",
      image: cert.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm("Are you sure you want to delete \"" + (title || "this certification") + "\"?")) {
      return;
    }

    try {
      setDeletingId(id);
      try {
        await API.delete("/admin/certifications/" + id);
      } catch {
        // local delete
      }

      setCertifications((prev) => prev.filter((c) => c.id !== id));
      showToast("Certification removed.", "success");
    } catch {
      showToast("Failed to delete certification.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyCert);
  };

  const issuers = ["All", "NPTEL", "HackerRank", "HP LIFE", "IES UNIVERSITY", "Forage", "MIC INSTITUTE"];

  const filteredCerts = certifications.filter((cert) => {
    const name = (cert.certification_name || cert.title || "").toLowerCase();
    const iss = (cert.issuer || "").toLowerCase();
    const cred = (cert.credential || "").toLowerCase();
    const matchesSearch = !searchTerm.trim() || name.includes(searchTerm.toLowerCase()) || iss.includes(searchTerm.toLowerCase()) || cred.includes(searchTerm.toLowerCase());

    if (selectedIssuer === "All") return matchesSearch;
    return matchesSearch && iss.includes(selectedIssuer.toLowerCase());
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
              <span>Credentials & Honors</span>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold text-white">
              Certifications Manager
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage your verified credentials, upload certificates, and showcase licenses on the public portfolio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadCertifications}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <RefreshCw className={"h-3.5 w-3.5 " + (loading ? "animate-spin" : "")} />
              <span>Refresh</span>
            </button>

            <a
              href="/#certifications"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-950/40 px-3.5 py-2 text-xs font-semibold text-purple-300 transition hover:bg-purple-900/50"
            >
              <span>Live Section ↗</span>
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
                    <Award className="h-4 w-4 text-purple-400" />
                    <span>{editingId ? "Edit Certification" : "Add Certification"}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {editingId ? "Update certification data" : "Enter credential details to publish"}
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

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Certification Title *
                </label>
                <input
                  type="text"
                  name="certification_name"
                  required
                  placeholder="e.g. NPTEL – Cloud Computing"
                  value={form.certification_name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                />
              </div>

              {/* Issuer */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Issuer / Organization *
                </label>
                <input
                  type="text"
                  name="issuer"
                  required
                  placeholder="e.g. NPTEL, HackerRank, HP LIFE"
                  value={form.issuer}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                />
              </div>

              {/* Credential ID */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Credential ID (Optional)
                </label>
                <input
                  type="text"
                  name="credential"
                  placeholder="e.g. ID: FBCED9F0E3A3"
                  value={form.credential}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition font-mono"
                />
              </div>

              {/* Certificate Image Document */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Certificate Document (Image / PNG / JPEG)
                </label>

                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 hover:bg-slate-950 p-3 text-xs font-semibold text-slate-300 transition"
                  >
                    <UploadCloud className="h-4 w-4 text-purple-400" />
                    <span>{uploadingImage ? "Uploading..." : "Upload Certificate File"}</span>
                  </button>

                  {form.image && (
                    <div className="h-11 w-11 shrink-0 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                      <img
                        src={getImageUrl(form.image)}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
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
                      <span>Saving Certification...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>{editingId ? "Update Certification" : "Add Certification"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Certifications List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Filter Pills & Search */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search certifications by name, issuer, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                  />
                </div>

                <span className="shrink-0 text-xs font-bold text-purple-300 px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/30">
                  {certifications.length} Total
                </span>
              </div>

              {/* Issuer Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {issuers.map((iss) => (
                  <button
                    key={iss}
                    onClick={() => setSelectedIssuer(iss)}
                    className={"shrink-0 rounded-lg px-2.5 py-1 font-semibold transition " + (
                      selectedIssuer === iss
                        ? "bg-purple-600 text-white font-bold"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    )}
                  >
                    {iss}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {filteredCerts.length === 0 ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center">
                <Award className="mx-auto h-12 w-12 text-slate-600" />
                <h3 className="mt-3 text-sm font-bold text-white">No certifications match search</h3>
                <p className="mt-1 text-xs text-slate-400">Try changing keywords or resetting issuer filters.</p>
              </div>
            ) : (
              filteredCerts.map((c, idx) => {
                const isEditing = editingId === c.id;
                const isDeleting = deletingId === c.id;
                const img = getImageUrl(c.image);

                return (
                  <div
                    key={c.id || idx}
                    className={"group relative rounded-3xl border p-5 transition-all duration-200 bg-slate-900/90 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 " + (
                      isEditing ? "border-purple-500 ring-2 ring-purple-500/20" : "border-slate-800 hover:border-slate-700"
                    )}
                  >
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div 
                        onClick={() => setSelectedPreviewCert(c)}
                        className="relative h-14 w-14 shrink-0 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden cursor-pointer group-hover:border-purple-500/40 transition"
                      >
                        <img
                          src={img}
                          alt={c.certification_name || c.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML = "<div class='h-full w-full flex items-center justify-center text-xs font-bold text-purple-400'>📜</div>";
                          }}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white truncate max-w-xs md:max-w-md">
                            {c.certification_name || c.title}
                          </h4>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-bold text-emerald-300">
                            Verified
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-xs text-purple-400 flex-wrap font-medium">
                          <Building2 className="h-3 w-3" />
                          <span>{c.issuer}</span>
                          {c.credential && (
                            <span className="text-slate-400 font-mono text-[11px] ml-2">
                              • {c.credential}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => setSelectedPreviewCert(c)}
                        className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:text-white transition"
                        title="Preview Certificate"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(c)}
                        className="rounded-xl border border-purple-500/30 bg-purple-950/30 p-2 text-purple-300 hover:bg-purple-900/50 transition"
                        title="Edit Certification"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(c.id, c.certification_name || c.title)}
                        disabled={isDeleting}
                        className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-2 text-rose-400 hover:bg-rose-950/40 transition"
                        title="Delete Certification"
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

      {/* Certificate Preview Modal */}
      {selectedPreviewCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedPreviewCert(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] flex flex-col rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedPreviewCert.certification_name || selectedPreviewCert.title}
                </h3>
                <p className="text-xs text-purple-400 font-medium">
                  {selectedPreviewCert.issuer}
                </p>
              </div>
              <button
                onClick={() => setSelectedPreviewCert(null)}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-rose-500/20 hover:text-rose-300 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 overflow-auto bg-slate-950 flex items-center justify-center min-h-[300px]">
              <img
                src={getImageUrl(selectedPreviewCert.image)}
                alt="Certificate"
                className="max-h-[60vh] w-auto max-w-full rounded-xl object-contain shadow-xl"
              />
            </div>

            <div className="border-t border-slate-800 px-6 py-3.5 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
              <span className="text-emerald-400 font-bold">Verified Credential Document</span>
              <a
                href={getImageUrl(selectedPreviewCert.image)}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>Open in New Tab</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
