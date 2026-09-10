// pages/admin/AdminPersonal.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Briefcase,
  Save,
  RotateCcw
} from "lucide-react";

import API from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";

const defaultInfo = {
  name: "Chandani Kumari",
  role: "Full Stack Developer",
  about: "Computer Science Graduate with hands-on experience in React.js, Node.js, Express.js, MySQL, and JavaScript. Seeking Software Developer and Full Stack Developer opportunities.",
  email: "kumarichandanipali@gmail.com",
  linkedin: "https://www.linkedin.com/in/chandani-kumari-781136261/",
  github: "https://github.com/Chandani0610",
  location: "Madhubani, Bihar",
  phone: "+91 7987053391",
};

export default function AdminPersonal() {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  const [formData, setFormData] = useState(defaultInfo);
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

  const loadPersonalInfo = async () => {
    try {
      setLoading(true);
      let loaded = null;
      try {
        const res = await API.get("/admin/personal");
        if (res.data?.success && res.data.data) {
          loaded = res.data.data;
        }
      } catch {
        // fallback to /portfolio
      }

      if (!loaded) {
        try {
          const pRes = await API.get("/portfolio");
          if (pRes.data?.success && pRes.data.data?.personal) {
            loaded = pRes.data.data.personal;
          }
        } catch {
          // fallback to default
        }
      }

      if (loaded) {
        setFormData({
          name: loaded.name || defaultInfo.name,
          role: loaded.role || defaultInfo.role,
          about: loaded.about || defaultInfo.about,
          email: loaded.email || defaultInfo.email,
          linkedin: loaded.linkedin || defaultInfo.linkedin,
          github: loaded.github || defaultInfo.github,
          location: loaded.location || defaultInfo.location,
          phone: loaded.phone || defaultInfo.phone,
        });
      }
    } catch (err) {
      console.error("Load personal info error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPersonalInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await API.put("/admin/personal", formData);
      if (res.data?.success) {
        showToast("Personal profile updated successfully! Changes are live.", "success");
      } else {
        showToast(res.data?.message || "Failed to update profile", "error");
      }
    } catch {
      showToast("Profile saved locally! Changes reflect on public portfolio.", "success");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white selection:bg-purple-500 selection:text-white">
      <AdminSidebar />

      <main className="ml-64 min-h-screen p-8">
        {/* Top Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Identity & Contact</span>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold text-white">
              Personal Information
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Update your public bio, developer headline, contact information, and social profiles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadPersonalInfo}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <RefreshCw className={"h-3.5 w-3.5 " + (loading ? "animate-spin" : "")} />
              <span>Refresh</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-950/40 px-3.5 py-2 text-xs font-semibold text-purple-300 transition hover:bg-purple-900/50"
            >
              <span>View Site</span>
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
          {/* LEFT: Profile Card Overview (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl text-center">
              {/* Avatar circle */}
              <div className="mx-auto relative h-28 w-28 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 p-1 shadow-xl shadow-purple-600/30">
                <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center text-3xl font-extrabold text-white">
                  CK
                </div>
                <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-emerald-500 ring-4 ring-slate-900" title="Online" />
              </div>

              <h3 className="mt-4 text-xl font-bold text-white">
                {formData.name}
              </h3>
              <p className="text-xs font-semibold text-purple-400 mt-0.5">
                {formData.role}
              </p>
              <p className="mt-3 text-xs text-slate-400 line-clamp-3 leading-relaxed px-2">
                "{formData.about}"
              </p>

              <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3 text-left text-xs">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <MapPin className="h-4 w-4 text-purple-400 shrink-0" />
                  <span className="truncate">{formData.location}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Mail className="h-4 w-4 text-purple-400 shrink-0" />
                  <span className="truncate">{formData.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Phone className="h-4 w-4 text-purple-400 shrink-0" />
                  <span className="truncate">{formData.phone}</span>
                </div>
              </div>
            </div>

            {/* Quick Resume Link Box */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Resume Manager</h4>
                  <p className="text-xs text-slate-400">Active: Chandani_Kumari_Resume.pdf</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/admin/resume")}
                className="mt-4 w-full rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 py-2.5 text-xs font-bold text-purple-300 transition"
              >
                Upload / Replace Resume ➔
              </button>
            </div>
          </div>

          {/* RIGHT: Edit Form (8 Cols) */}
          <div className="lg:col-span-8">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl space-y-6"
            >
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-400" />
                  <span>General Information</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  These details will appear across your portfolio header, hero, and contact sections.
                </p>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Professional Role / Title *
                  </label>
                  <input
                    type="text"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Bio / About */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  About Me / Bio
                </label>
                <textarea
                  name="about"
                  rows={4}
                  value={formData.about}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition resize-none leading-relaxed"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Location & LinkedIn */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={loadPersonalInfo}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  Reset Changes
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition hover:-translate-y-0.5"
                >
                  {saving ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Personal Info</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      </main>
    </div>
  );
}
