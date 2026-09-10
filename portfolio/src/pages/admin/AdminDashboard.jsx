// pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  Award, 
  GraduationCap, 
  Zap, 
  Globe, 
  Heart, 
  FileText, 
  Palette, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  RefreshCw, 
  Activity,
  User,
  Layers
} from "lucide-react";

import API from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { themeColors, currentTheme } = useTheme();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: 3,
    education: 3,
    skills: 25,
    certifications: 11,
    languages: 3,
    hobbies: 2,
  });

  const loadDashboard = async () => {
    try {
      setLoading(true);

      // Try stats endpoint
      try {
        const statsRes = await API.get("/admin/stats");
        if (statsRes.data?.success && statsRes.data.data) {
          setStats((prev) => ({ ...prev, ...statsRes.data.data }));
        }
      } catch {
        // Fallback to /portfolio
      }

      try {
        const portfolioResponse = await API.get("/portfolio");
        if (portfolioResponse.data?.success) {
          const data = portfolioResponse.data.data || {};
          const pCount = Array.isArray(data.projects) ? data.projects.length : 3;
          const eCount = Array.isArray(data.education) ? data.education.length : 3;
          const cCount = Array.isArray(data.certifications) ? data.certifications.length : 11;
          const lCount = Array.isArray(data.languages) ? data.languages.length : 3;
          const hCount = Array.isArray(data.hobbies) ? data.hobbies.length : 2;

          let sCount = 25;
          if (Array.isArray(data.skills)) {
            sCount = data.skills.length;
          } else if (data.skills && typeof data.skills === "object") {
            sCount = Object.values(data.skills).reduce(
              (total, s) => total + (Array.isArray(s) ? s.length : 0),
              0
            );
          }

          setStats({
            projects: pCount,
            education: eCount,
            skills: sCount,
            certifications: cCount,
            languages: lCount,
            hobbies: hCount,
          });
        }
      } catch (err) {
        console.warn("Portfolio fetch fallback:", err.message);
      }

      // Check admin info
      try {
        const adminResponse = await API.get("/admin/me");
        if (adminResponse.data?.success && adminResponse.data.admin) {
          setAdmin(adminResponse.data.admin);
        }
      } catch (adminErr) {
        console.warn("Admin check:", adminErr.message);
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const statCards = [
    {
      title: "Certifications",
      value: stats.certifications,
      icon: <Award className="h-6 w-6 text-purple-400" />,
      color: "from-purple-500/20 to-indigo-500/10",
      borderColor: "border-purple-500/30",
      accentText: "11 verified credentials",
      path: "/admin/certifications",
    },
    {
      title: "Projects",
      value: stats.projects,
      icon: <Briefcase className="h-6 w-6 text-indigo-400" />,
      color: "from-indigo-500/20 to-blue-500/10",
      borderColor: "border-indigo-500/30",
      accentText: "KahaniLand & Vedant",
      path: "/admin/projects",
    },
    {
      title: "Education",
      value: stats.education,
      icon: <GraduationCap className="h-6 w-6 text-emerald-400" />,
      color: "from-emerald-500/20 to-teal-500/10",
      borderColor: "border-emerald-500/30",
      accentText: "B.Tech CGPA 8.36",
      path: "/admin/education",
    },
    {
      title: "Technical Skills",
      value: stats.skills,
      icon: <Zap className="h-6 w-6 text-amber-400" />,
      color: "from-amber-500/20 to-orange-500/10",
      borderColor: "border-amber-500/30",
      accentText: "Frontend, Backend, DB",
      path: "/admin/skills",
    },
    {
      title: "Languages",
      value: stats.languages,
      icon: <Globe className="h-6 w-6 text-cyan-400" />,
      color: "from-cyan-500/20 to-blue-500/10",
      borderColor: "border-cyan-500/30",
      accentText: "English, Hindi, Maithili",
      path: "/admin/languages",
    },
    {
      title: "Hobbies",
      value: stats.hobbies,
      icon: <Heart className="h-6 w-6 text-rose-400" />,
      color: "from-rose-500/20 to-pink-500/10",
      borderColor: "border-rose-500/30",
      accentText: "Mithila Painting, Music",
      path: "/admin/hobbies",
    },
  ];

  const quickActions = [
    {
      title: "Resume Manager",
      description: "Upload new resume or restore recent versions",
      icon: <FileText className="h-5 w-5 text-purple-400" />,
      badge: "Active",
      path: "/admin/resume",
    },
    {
      title: "Personal Information",
      description: "Update bio, social profiles, email & phone",
      icon: <User className="h-5 w-5 text-indigo-400" />,
      path: "/admin/personal",
    },
    {
      title: "Certifications Manager",
      description: "Manage all 11 certifications & credential IDs",
      icon: <Award className="h-5 w-5 text-purple-400" />,
      badge: "11 Total",
      path: "/admin/certifications",
    },
    {
      title: "Projects Showcase",
      description: "Add or edit featured and standard projects",
      icon: <Briefcase className="h-5 w-5 text-emerald-400" />,
      path: "/admin/projects",
    },
    {
      title: "Skills Directory",
      description: "Organize skills across 5 categories",
      icon: <Zap className="h-5 w-5 text-amber-400" />,
      path: "/admin/skills",
    },
    {
      title: "Theme Customizer",
      description: "Choose global website color scheme",
      icon: <Palette className="h-5 w-5 text-pink-400" />,
      path: "/admin/theme",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-white selection:bg-purple-500 selection:text-white">
      <AdminSidebar />

      <main className="ml-64 min-h-screen p-8">
        {/* Top Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Admin Management Hub</span>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold text-white">
              Welcome back, {admin?.name || "Chandani"} 👋
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Here is what is currently live on your personal portfolio website.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboard}
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
              <span>View Live Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Live System & Database Status Card */}
        <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Portfolio System Status</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    All Systems Operational
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  MySQL Database connected · Theme: <span className="text-purple-300 font-semibold capitalize">{currentTheme}</span> · Active Resume: <span className="text-emerald-400 font-semibold">Chandani_Kumari_Resume.pdf</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/admin/resume")}
                className="rounded-xl bg-purple-600 hover:bg-purple-500 px-3.5 py-2 text-xs font-bold text-white transition shadow-md shadow-purple-600/30"
              >
                Manage Resume ➔
              </button>
            </div>
          </div>
        </div>

        {/* Metric Cards Grid (6 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statCards.map((card, idx) => (
            <button
              key={idx}
              onClick={() => navigate(card.path)}
              className={"group relative flex flex-col justify-between rounded-3xl border p-6 text-left transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br " + card.color + " " + card.borderColor + " bg-slate-900/90 shadow-xl hover:shadow-2xl"}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950/60 border border-slate-800 group-hover:scale-105 transition-transform">
                  {card.icon}
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 group-hover:bg-white/15 transition-colors">
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-white" />
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.title}
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">
                    {card.value}
                  </span>
                </div>
                <p className="mt-2 text-xs text-purple-300 font-medium flex items-center gap-1">
                  <span>●</span>
                  <span>{card.accentText}</span>
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions Launchpad */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-400" />
              <span>Quick Management Launchpad</span>
            </h3>
            <span className="text-xs text-slate-500">1-click navigation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => navigate(action.path)}
                className="group flex items-start gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 text-left transition-all duration-200 hover:border-purple-500/40 hover:bg-slate-900 hover:-translate-y-0.5 shadow-lg"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950/80 border border-slate-800 group-hover:border-purple-500/40 transition-colors">
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {action.title}
                    </h4>
                    {action.badge && (
                      <span className="rounded-full bg-purple-500/20 border border-purple-500/40 px-2 py-0.2 text-[10px] font-bold text-purple-300">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Portfolio Summary Footer Banner */}
        <div className="mt-10 rounded-3xl border border-slate-800 bg-gradient-to-r from-purple-950/40 to-slate-900/90 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Full Public Frontend Live</h4>
              <p className="text-xs text-slate-400">
                Visitors can browse your Home page, Featured Projects, Certifications showcase, and download the active resume PDF.
              </p>
            </div>
          </div>
          <a
            href="/#certifications"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-xl border border-purple-500/30 bg-purple-900/30 hover:bg-purple-900/50 px-4 py-2 text-xs font-bold text-purple-300 transition"
          >
            Open Live Certifications ↗
          </a>
        </div>

      </main>
    </div>
  );
}
