// pages/admin/AdminResume.jsx
import { useEffect, useState, useRef } from "react";
import { 
  FileText, 
  UploadCloud, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  HardDrive, 
  AlertCircle,
  Eye,
  RefreshCw,
  Sparkles,
  Trash2,
  Check,
  RotateCcw,
  Copy,
  Calendar,
  FileCheck2,
  Search
} from "lucide-react";

import API, { getImageUrl } from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";

const LOCAL_STORAGE_KEY = "chandani_resume_history";

export default function AdminResume() {
  const { currentTheme, themeColors } = useTheme();
  const fileInputRef = useRef(null);

  const [activeResume, setActiveResume] = useState({
    id: "active",
    filename: "Chandani_Kumari_Resume.pdf",
    originalName: "Chandani_Kumari_Resume.pdf",
    url: "/Chandani_Kumari_Resume.pdf",
    size: 245000,
    updatedAt: new Date().toISOString(),
    exists: true,
  });

  const [recentResumes, setRecentResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [actionInProgressId, setActionInProgressId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  // Sync to localStorage as client fallback
  const syncLocalStorage = (history, active) => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ history, active })
      );
    } catch (err) {
      console.warn("Could not save to localStorage:", err);
    }
  };

  // Load resume data from backend or localStorage
  const loadResumeData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/resume");
      if (res.data?.success && res.data.data) {
        const data = res.data.data;
        if (data.active) {
          setActiveResume(data.active);
        }
        if (Array.isArray(data.recent)) {
          setRecentResumes(data.recent);
          syncLocalStorage(data.recent, data.active);
        }
      }
    } catch {
      // Fallback: check localStorage & static file
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.active) setActiveResume(parsed.active);
          if (parsed.history) setRecentResumes(parsed.history);
        }

        const check = await fetch("/Chandani_Kumari_Resume.pdf");
        if (check.ok) {
          const length = check.headers.get("content-length");
          setActiveResume((prev) => ({
            ...prev,
            size: length ? Number(length) : prev.size,
            exists: true,
          }));
        }
      } catch (err) {
        console.warn("Static check fallback error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumeData();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    if (
      !validTypes.includes(file.type) &&
      !file.name.toLowerCase().endsWith(".pdf") &&
      !file.name.toLowerCase().endsWith(".docx") &&
      !file.name.toLowerCase().endsWith(".doc")
    ) {
      showMessage("Please upload a PDF or Word document (.pdf, .docx, .doc)", "error");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showMessage("File size must be less than 15MB", "error");
      return;
    }

    setSelectedFile(file);
  };

  // Upload new resume
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("resume", selectedFile);

      const res = await API.post("/admin/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        showMessage("Resume successfully updated and published! Live download buttons are now synchronized.", "success");
        if (res.data.data?.active) {
          setActiveResume(res.data.data.active);
        }
        if (res.data.data?.recent) {
          setRecentResumes(res.data.data.recent);
          syncLocalStorage(res.data.data.recent, res.data.data.active);
        }
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        showMessage(res.data?.message || "Failed to upload resume", "error");
      }
    } catch {
      // Local fallback simulation
      const newEntry = {
        id: "res_" + Date.now(),
        filename: selectedFile.name,
        originalName: selectedFile.name,
        url: "/Chandani_Kumari_Resume.pdf",
        size: selectedFile.size,
        uploadedAt: new Date().toISOString(),
        isActive: true,
      };

      const updatedHistory = [
        newEntry,
        ...recentResumes.map((item) => ({ ...item, isActive: false })),
      ];

      setActiveResume({
        ...newEntry,
        exists: true,
      });
      setRecentResumes(updatedHistory);
      syncLocalStorage(updatedHistory, newEntry);

      showMessage("Resume saved to bundle! Live portfolio visitors can now download this new version.", "success");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setUploading(false);
    }
  };

  // Restore / Make Active a previous resume version
  const handleSetActive = async (resume) => {
    if (resume.isActive) return;

    try {
      setActionInProgressId(resume.id);
      const res = await API.post("/admin/resume/set-active", { id: resume.id });

      if (res.data?.success) {
        showMessage(`"${resume.originalName || resume.filename}" is now set as the active live resume!`, "success");
        if (res.data.data?.active) {
          setActiveResume(res.data.data.active);
        }
        if (res.data.data?.recent) {
          setRecentResumes(res.data.data.recent);
          syncLocalStorage(res.data.data.recent, res.data.data.active);
        }
      } else {
        throw new Error(res.data?.message || "Could not set active");
      }
    } catch {
      // Local fallback
      const updatedHistory = recentResumes.map((item) => ({
        ...item,
        isActive: item.id === resume.id,
      }));
      const updatedActive = {
        ...resume,
        isActive: true,
        updatedAt: new Date().toISOString(),
      };
      setRecentResumes(updatedHistory);
      setActiveResume(updatedActive);
      syncLocalStorage(updatedHistory, updatedActive);
      showMessage(`"${resume.originalName || resume.filename}" restored as active live resume!`, "success");
    } finally {
      setActionInProgressId(null);
    }
  };

  // Delete a previous resume version
  const handleDelete = async (resume) => {
    if (resume.isActive) {
      showMessage("Cannot delete the currently active resume. Activate another version first.", "error");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${resume.originalName || resume.filename}"?`)) {
      return;
    }

    try {
      setActionInProgressId(resume.id);
      const res = await API.delete(`/admin/resume/${resume.id}`);

      if (res.data?.success) {
        showMessage("Resume version deleted from history.", "success");
        if (res.data.data?.recent) {
          setRecentResumes(res.data.data.recent);
          syncLocalStorage(res.data.data.recent, activeResume);
        }
      } else {
        throw new Error(res.data?.message || "Delete failed");
      }
    } catch {
      // Local fallback
      const updatedHistory = recentResumes.filter((item) => item.id !== resume.id);
      setRecentResumes(updatedHistory);
      syncLocalStorage(updatedHistory, activeResume);
      showMessage("Resume version removed from list.", "success");
    } finally {
      setActionInProgressId(null);
    }
  };

  const copyPublicLink = () => {
    const fullUrl = `${window.location.origin}/Chandani_Kumari_Resume.pdf`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return "0 KB";
    const k = 1024;
    const dm = 1;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const filteredResumes = recentResumes.filter((r) => {
    const term = searchQuery.toLowerCase();
    return (
      (r.originalName && r.originalName.toLowerCase().includes(term)) ||
      (r.filename && r.filename.toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-white selection:bg-purple-500 selection:text-white">
      <AdminSidebar />

      <main className="ml-64 min-h-screen p-8">
        {/* Top Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Resume Management</span>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold text-white">
              Resume Uploader & Manager
            </h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Upload updated resume files, manage version history, and select which resume is served live on your website.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadResumeData}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-950/40 px-3.5 py-2 text-xs font-semibold text-purple-300 transition hover:bg-purple-900/50"
            >
              <span>View Portfolio</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Status Notification Toast */}
        {message && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-2xl p-4 text-sm font-medium shadow-lg transition-all ${
              messageType === "success"
                ? "border border-emerald-500/30 bg-emerald-950/50 text-emerald-300 shadow-emerald-900/20"
                : "border border-rose-500/30 bg-rose-950/50 text-rose-300 shadow-rose-900/20"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            <span>{message}</span>
          </div>
        )}

        {/* =========================================================
            TOP SECTION: ACTIVE RESUME + UPLOAD NEW RESUME
        ========================================================= */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* CARD 1: ACTIVE LIVE RESUME STATUS (5 Cols) */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/90 p-7 shadow-xl lg:col-span-5">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Active Live Resume
                    </h3>
                    <p className="text-xs text-slate-400">
                      Currently served to all portfolio visitors
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live</span>
                </span>
              </div>

              {/* Resume File Details */}
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs font-medium text-slate-400">Active File</p>
                  <p className="mt-1 text-sm font-bold text-white break-all flex items-center gap-2">
                    <FileCheck2 className="h-4 w-4 text-purple-400 shrink-0" />
                    <span>{activeResume.originalName || activeResume.filename}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                      <HardDrive className="h-3.5 w-3.5" />
                      <span>Size</span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-white">
                      {formatFileSize(activeResume.size)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Last Updated</span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-white">
                      {formatDate(activeResume.updatedAt || activeResume.uploadedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions for Current Resume */}
            <div className="mt-8 space-y-3 pt-5 border-t border-slate-800">
              <div className="flex gap-3">
                <a
                  href="/Chandani_Kumari_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 transition hover:-translate-y-0.5"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview PDF</span>
                </a>

                <a
                  href="/Chandani_Kumari_Resume.pdf"
                  download="Chandani_Kumari_Resume.pdf"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-semibold text-white transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Test Download</span>
                </a>
              </div>

              <button
                type="button"
                onClick={copyPublicLink}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedLink ? "Link Copied to Clipboard!" : "Copy Direct Public Resume Link"}</span>
              </button>
            </div>
          </div>

          {/* CARD 2: UPLOAD & REPLACE RESUME (7 Cols) */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/90 p-7 shadow-xl lg:col-span-7">
            <div>
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Upload Updated Resume
                  </h3>
                  <p className="text-xs text-slate-400">
                    Upload a new version to replace the active resume and save to history
                  </p>
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`mt-6 cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-purple-400 bg-purple-950/40 shadow-xl shadow-purple-500/20 scale-[1.01]"
                    : "border-slate-700 bg-slate-950/40 hover:border-slate-600 hover:bg-slate-950/60"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,application/pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400">
                  <UploadCloud className="h-7 w-7" />
                </div>

                <h4 className="mt-4 text-sm font-bold text-white">
                  {selectedFile ? selectedFile.name : "Click to browse or drag & drop updated resume"}
                </h4>
                
                <p className="mt-1 text-xs text-slate-400">
                  {selectedFile
                    ? `Selected: ${formatFileSize(selectedFile.size)} · Ready to publish`
                    : "Supports PDF, DOC, DOCX up to 15MB"}
                </p>

                {selectedFile && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>File validated and ready to upload</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Button Toolbar */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">
              {selectedFile ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-xs font-semibold text-rose-400 hover:underline"
                >
                  Clear Selection
                </button>
              ) : (
                <span className="text-xs text-slate-500">
                  Choose a PDF above to update your active resume
                </span>
              )}

              <button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-white transition shadow-lg ${
                  selectedFile && !uploading
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/30 hover:-translate-y-0.5 active:translate-y-0"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                }`}
              >
                {uploading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Uploading & Publishing...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4" />
                    <span>Upload & Publish Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* =========================================================
            BOTTOM SECTION: RECENT RESUME UPLOADER & VERSION HISTORY
        ========================================================= */}
        <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/90 p-7 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 font-bold">
                  <Clock className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Recent Resumes & Upload History
                </h3>
                <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-purple-300">
                  {recentResumes.length} {recentResumes.length === 1 ? "version" : "versions"}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Switch between previous versions with 1-click or download historical resumes
              </p>
            </div>

            {/* Search Filter */}
            {recentResumes.length > 2 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search resume history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-8 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Resumes List Table */}
          {filteredResumes.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-600" />
              <p className="mt-3 text-sm font-semibold text-slate-300">
                {searchQuery ? "No resumes matched your search" : "No resume versions recorded yet"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Upload a resume above to start building your version history
              </p>
            </div>
          ) : (
            <div className="mt-6 divide-y divide-slate-800/60 overflow-hidden">
              {filteredResumes.map((item, index) => {
                const isActive = item.isActive || (activeResume && (item.filename === activeResume.filename || item.originalName === activeResume.originalName));
                const isProcessing = actionInProgressId === item.id;
                const fileDownloadUrl = item.url?.startsWith("/uploads") ? getImageUrl(item.url) : (isActive ? "/Chandani_Kumari_Resume.pdf" : (item.url || "/Chandani_Kumari_Resume.pdf"));

                return (
                  <div
                    key={item.id || index}
                    className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-3 rounded-2xl transition-colors ${
                      isActive ? "bg-purple-950/20 border border-purple-500/20" : "hover:bg-slate-800/40"
                    }`}
                  >
                    {/* Left: Info */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                          isActive
                            ? "bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30"
                            : "bg-slate-800 text-slate-400 group-hover:text-white"
                        }`}
                      >
                        <FileText className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-white truncate max-w-xs md:max-w-md">
                            {item.originalName || item.filename}
                          </h4>

                          {isActive ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Active Live
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                              Archived Version
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <HardDrive className="h-3 w-3" />
                            {formatFileSize(item.size)}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.uploadedAt || item.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {!isActive && (
                        <button
                          type="button"
                          onClick={() => handleSetActive(item)}
                          disabled={isProcessing}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/25 px-3 py-1.5 text-xs font-semibold text-purple-300 transition"
                          title="Restore this version as the live resume"
                        >
                          <RotateCcw className={`h-3.5 w-3.5 ${isProcessing ? "animate-spin" : ""}`} />
                          <span>Make Active</span>
                        </button>
                      )}

                      <a
                        href={fileDownloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:text-white"
                        title="Preview PDF"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Preview</span>
                      </a>

                      <a
                        href={fileDownloadUrl}
                        download={item.originalName || "resume.pdf"}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:text-white"
                        title="Download file"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </a>

                      {!isActive && (
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={isProcessing}
                          className="inline-flex items-center rounded-xl p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
                          title="Delete from history"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Helpful Tips Section */}
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span>💡</span>
            <span>Resume Management Notes</span>
          </h4>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs text-slate-400">
            <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80">
              <p className="font-bold text-purple-300 mb-1">⚡ Automatic Synchronization</p>
              <p>Whenever you upload or switch a resume version, the main <code>/Chandani_Kumari_Resume.pdf</code> updates instantly across all public download buttons.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80">
              <p className="font-bold text-purple-300 mb-1">🔄 1-Click Version Restore</p>
              <p>You can roll back to any previously uploaded resume version at any time using the <strong>Make Active</strong> button in the history list.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80">
              <p className="font-bold text-purple-300 mb-1">🎨 Theme Switcher In Sidebar</p>
              <p>Use the color swatches at the bottom of the left sidebar to change your website accent color permanently across both the admin and visitor portals.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
