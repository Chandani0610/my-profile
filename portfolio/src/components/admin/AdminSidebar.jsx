import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import API, { clearAuthToken } from "../../services/api";
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  GraduationCap, 
  Zap, 
  Award, 
  Globe, 
  Heart, 
  Palette, 
  FileText, 
  LogOut, 
  ExternalLink,
  Check
} from "lucide-react";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { currentTheme, changeTheme, saveTheme } = useTheme();
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [isSwitchingTheme, setIsSwitchingTheme] = useState(false);

  const handleLogout = async () => {
    try {
      await API.post("/admin/logout");
    } catch {
      // Ignore network errors on logout
    } finally {
      clearAuthToken();
      navigate("/admin");
    }
  };

  const handleSelectTheme = async (themeId) => {
    if (themeId === currentTheme) return;
    changeTheme(themeId);
    try {
      setIsSwitchingTheme(true);
      if (saveTheme) {
        await saveTheme(themeId);
      }
    } catch (err) {
      console.warn("Theme saved locally, backend sync note:", err);
    } finally {
      setIsSwitchingTheme(false);
    }
  };

  const availableThemes = [
    { id: "purple", name: "Royal Purple", color: "#7c3aed" },
    { id: "emerald", name: "Emerald Green", color: "#059669" },
    { id: "blue", name: "Ocean Blue", color: "#0284c7" },
    { id: "rose", name: "Crimson Rose", color: "#e11d48" },
    { id: "orange", name: "Sunset Orange", color: "#ea580c" },
    { id: "dark", name: "Midnight Dark", color: "#0f172a" },
  ];

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      name: "Personal Info",
      path: "/admin/personal",
      icon: <User className="h-4 w-4" />,
    },
    {
      name: "Resume Manager",
      path: "/admin/resume",
      icon: <FileText className="h-4 w-4" />,
      badge: "New",
    },
    {
      name: "Projects",
      path: "/admin/projects",
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      name: "Education",
      path: "/admin/education",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      name: "Skills",
      path: "/admin/skills",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      name: "Certifications",
      path: "/admin/certifications",
      icon: <Award className="h-4 w-4" />,
      count: 11,
    },
    {
      name: "Languages",
      path: "/admin/languages",
      icon: <Globe className="h-4 w-4" />,
    },
    {
      name: "Hobbies",
      path: "/admin/hobbies",
      icon: <Heart className="h-4 w-4" />,
    },
    {
      name: "Website Theme",
      path: "/admin/theme",
      icon: <Palette className="h-4 w-4" />,
    },
  ];


  const activeColor = availableThemes.find((t) => t.id === currentTheme)?.color || "#7c3aed";

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-800 bg-[#0c1322] text-white shadow-2xl">
      {/* Brand & Direct Live Site Button */}
      <div className="border-b border-slate-800/80 px-5 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div 
              className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white shadow-md"
              style={{ backgroundColor: activeColor }}
            >
              CK
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight text-white">
                Chandani
              </h1>
              <p className="text-[11px] font-medium text-slate-400">
                Portfolio Admin
              </p>
            </div>
          </div>
          <span 
            className="rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ backgroundColor: `${activeColor}25`, color: activeColor }}
          >
            PRO
          </span>
        </div>

        {/* Live Site Link Button */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white hover:border-slate-600"
        >
          <span>🌐 View Live Portfolio</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "text-white font-bold shadow-md"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? activeColor : "transparent",
              boxShadow: isActive ? `0 4px 14px ${activeColor}40` : "none",
            })}
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? "text-white" : "text-slate-400"}>
                  {item.icon}
                </span>
                <span>{item.name}</span>

                {/* Badges / Counters */}
                {item.count && (
                  <span
                    className={`ml-auto rounded-full px-2 py-0.2 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-purple-500/20 text-purple-300"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span
                    className={`ml-auto rounded-full px-2 py-0.2 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* =========================================================
          THEME CHANGER DIRECTLY IN SIDEBAR
      ========================================================= */}
      <div className="border-t border-slate-800/80 p-3.5 bg-slate-950/40">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Palette className="h-3 w-3" />
            <span>Sidebar Theme Switcher</span>
          </span>
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            className="text-[10px] font-semibold text-purple-400 hover:underline"
          >
            {themeDropdownOpen ? "Less" : "All"}
          </button>
        </div>

        {/* 6 Theme Swatches with 1-click apply */}
        <div className="grid grid-cols-6 gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          {availableThemes.map((theme) => {
            const isCurrent = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleSelectTheme(theme.id)}
                title={`${theme.name}${isCurrent ? " (Active)" : ""}`}
                disabled={isSwitchingTheme}
                className={`relative flex h-7 items-center justify-center rounded-lg transition-transform hover:scale-110 active:scale-95 ${
                  isCurrent ? "ring-2 ring-white ring-offset-1 ring-offset-slate-900 shadow-md shadow-black/40" : "opacity-80 hover:opacity-100"
                }`}
                style={{ backgroundColor: theme.color }}
              >
                {isCurrent && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Selected Theme Label */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>Active:</span>
          <span className="font-bold text-white capitalize flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: activeColor }}
            />
            {availableThemes.find((t) => t.id === currentTheme)?.name || currentTheme}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500/10 py-2 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/20"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}