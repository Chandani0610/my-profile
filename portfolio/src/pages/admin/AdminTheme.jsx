// pages/admin/AdminTheme.jsx
import { useState } from "react";
import { 
  Palette, 
  Check, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Eye,
  RotateCcw,
  Sliders
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";

const themePresets = [
  {
    id: "purple",
    name: "Royal Purple",
    primary: "#7c3aed",
    secondary: "#a855f7",
    cardBg: "#17082e",
    description: "Deep luxury royal purple with radiant violet accents. Default portfolio signature theme.",
  },
  {
    id: "emerald",
    name: "Emerald Green",
    primary: "#059669",
    secondary: "#10b981",
    cardBg: "#062319",
    description: "Vibrant high-tech emerald green with fresh mint highlights. Clean and modern engineering feel.",
  },
  {
    id: "blue",
    name: "Ocean Blue",
    primary: "#0284c7",
    secondary: "#38bdf8",
    cardBg: "#06182c",
    description: "Deep oceanic azure with sky-blue highlights. Trustworthy and professional full-stack vibe.",
  },
  {
    id: "rose",
    name: "Crimson Rose",
    primary: "#e11d48",
    secondary: "#fb7185",
    cardBg: "#280713",
    description: "Bold crimson rose with warm ruby tones. High contrast and energetic aesthetic.",
  },
  {
    id: "orange",
    name: "Sunset Orange",
    primary: "#ea580c",
    secondary: "#fb923c",
    cardBg: "#271105",
    description: "Warm amber and fiery sunset orange. Creative, lively, and engaging.",
  },
  {
    id: "dark",
    name: "Midnight Dark",
    primary: "#64748b",
    secondary: "#94a3b8",
    cardBg: "#0f172a",
    description: "Ultra-sleek monochrome slate and midnight obsidian. Minimalist and developer-focused.",
  },
];

export default function AdminTheme() {
  const { currentTheme, changeTheme, saveTheme } = useTheme();

  const [savingThemeId, setSavingThemeId] = useState(null);
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

  const handleApplyTheme = async (themeId) => {
    try {
      setSavingThemeId(themeId);
      changeTheme(themeId);
      if (saveTheme) {
        await saveTheme(themeId);
      }
      showToast("Theme updated to \"" + (themePresets.find(t => t.id === themeId)?.name || themeId) + "\"! All visitors will see this color scheme.", "success");
    } catch {
      showToast("Theme applied locally.", "success");
    } finally {
      setSavingThemeId(null);
    }
  };

  const handleResetDefault = async () => {
    await handleApplyTheme("purple");
  };

  const activePreset = themePresets.find((t) => t.id === currentTheme) || themePresets[0];

  return (
    <div className="min-h-screen bg-[#070b14] text-white selection:bg-purple-500 selection:text-white">
      <AdminSidebar />

      <main className="ml-64 min-h-screen p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Visual Identity</span>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold text-white">
              Website Theme Settings
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Customize the global color palette across your portfolio and administrative portal with 1-click live synchronization.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDefault}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset to Royal Purple</span>
            </button>

            <a
              href="/"
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

        {/* Active Theme Highlight Banner */}
        <div className="mb-10 rounded-3xl border border-slate-800 bg-slate-900/90 p-7 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-xl ring-4 ring-white/10"
                style={{ backgroundColor: activePreset.primary }}
              >
                <Palette className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Active Color Scheme</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Across Website
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  {activePreset.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  {activePreset.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-xs text-slate-400">Primary Color:</span>
              <span className="font-mono text-xs font-bold text-white px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700">
                {activePreset.primary}
              </span>
            </div>
          </div>
        </div>

        {/* Theme Presets Grid (6 Themes) */}
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="h-4 w-4 text-purple-400" />
              <span>Choose Theme Preset</span>
            </h3>
            <span className="text-xs text-slate-400">Click any card to apply immediately</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themePresets.map((theme) => {
              const isActive = currentTheme === theme.id;
              const isSaving = savingThemeId === theme.id;

              return (
                <div
                  key={theme.id}
                  onClick={() => handleApplyTheme(theme.id)}
                  className={"group relative cursor-pointer rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 bg-slate-900/90 shadow-xl flex flex-col justify-between " + (
                    isActive
                      ? "border-white ring-2 ring-white/20 shadow-2xl"
                      : "border-slate-800 hover:border-slate-700 hover:shadow-2xl"
                  )}
                >
                  <div>
                    {/* Header with swatch & badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl shadow-md"
                          style={{ backgroundColor: theme.primary }}
                        >
                          {isActive ? <Check className="h-5 w-5 text-white stroke-[3]" /> : null}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">
                            {theme.name}
                          </h4>
                          <span className="font-mono text-[11px] text-slate-400">
                            {theme.primary}
                          </span>
                        </div>
                      </div>

                      {isActive ? (
                        <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 group-hover:text-slate-300 transition font-medium">
                          Click to apply
                        </span>
                      )}
                    </div>

                    {/* Palette swatches preview */}
                    <div className="h-8 rounded-xl overflow-hidden flex border border-slate-800 mb-4 shadow-inner">
                      <div className="flex-1" style={{ backgroundColor: theme.primary }} title="Primary" />
                      <div className="w-1/3" style={{ backgroundColor: theme.secondary }} title="Secondary" />
                      <div className="w-1/3" style={{ backgroundColor: theme.cardBg }} title="Dark Card Background" />
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {theme.description}
                    </p>
                  </div>

                  {/* Apply Button */}
                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      ID: <code>{theme.id}</code>
                    </span>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyTheme(theme.id);
                      }}
                      className={"rounded-xl px-4 py-1.5 text-xs font-bold transition shadow-md " + (
                        isActive
                          ? "bg-white/10 text-white border border-white/20"
                          : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30"
                      )}
                    >
                      {isActive ? "✓ Active Now" : (isSaving ? "Applying..." : "Apply Theme")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live UI Components Preview Playground */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-7 shadow-xl">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Eye className="h-4 w-4 text-purple-400" />
            <span>Theme UI Preview Playground</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl p-5 border border-slate-800 bg-slate-950 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400">Primary Button</span>
              <button
                type="button"
                className="mt-3 w-full py-2 text-xs font-bold rounded-xl text-white shadow-md transition"
                style={{ backgroundColor: activePreset.primary }}
              >
                Sample Button
              </button>
            </div>

            <div className="rounded-2xl p-5 border border-slate-800 bg-slate-950 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400">Accent Badges</span>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: activePreset.primary }}
                >
                  Active Tag
                </span>
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    backgroundColor: activePreset.primary + "25",
                    color: activePreset.secondary,
                  }}
                >
                  Subtle Tag
                </span>
              </div>
            </div>

            <div className="rounded-2xl p-5 border border-slate-800 bg-slate-950 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-400">Card Glow</span>
              <div
                className="mt-3 p-3 rounded-xl border text-xs font-medium"
                style={{
                  borderColor: activePreset.primary + "40",
                  backgroundColor: activePreset.primary + "15",
                  color: activePreset.secondary,
                }}
              >
                ✨ Dynamic Accent Card Preview
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
