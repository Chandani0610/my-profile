import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";

export default function AdminTheme() {
  const navigate = useNavigate();
  const {
    currentTheme,
    themes,
    themeOrder,
    changeTheme,
    saveTheme,
    isSaving,
    themeColors,
  } = useTheme();

  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSelect = async (themeKey) => {
    setSelectedTheme(themeKey);
    setMessage("");
    setError("");
    try {
      await saveTheme(themeKey);
      setMessage(`🎉 Successfully updated! "${themes[themeKey]?.name}" is now the active global theme across your entire website.`);
    } catch (err) {
      changeTheme(themeKey);
      setError(err?.response?.data?.message || "Failed to save theme. Please check your connection.");
    }
  };

  const handleSave = async () => {
    try {
      setMessage("");
      setError("");
      await saveTheme(selectedTheme);
      setMessage(`🎉 Successfully updated! "${themes[selectedTheme]?.name}" is now the active global theme across your entire website.`);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save theme. Please check your connection.");
    }
  };

  const handleReset = async () => {
    setSelectedTheme("purple");
    await saveTheme("purple");
    setMessage(`Reset active theme back to "Royal Purple".`);
  };

  const activeColors = themes[selectedTheme]?.colors || themeColors;

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: activeColors?.background || "#0f172a",
        color: activeColors?.text || "#ffffff",
      }}
    >
      <AdminSidebar />

      <main className="ml-64 min-h-screen p-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: activeColors?.primary || "#7c3aed" }}
            >
              ADMIN / THEME SETTINGS
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Website Theme Settings
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: activeColors?.textSecondary || "#94a3b8" }}
            >
              Choose the global theme for your entire portfolio website. Visitors will automatically see this theme.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="rounded-xl border px-4 py-2.5 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/10"
              style={{
                borderColor: activeColors?.border || "#e2e8f0",
                color: activeColors?.textSecondary || "#64748b",
              }}
            >
              ← Dashboard
            </button>
            <button
              onClick={() => window.open("/", "_blank")}
              className="flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/10"
              style={{
                borderColor: activeColors?.border || "#e2e8f0",
                color: activeColors?.textSecondary || "#64748b",
              }}
            >
              🌐 View Live Website
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50"
              style={{
                backgroundColor: activeColors?.primary || "#7c3aed",
                boxShadow: `0 8px 20px ${activeColors?.primary}40`,
              }}
            >
              {isSaving ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving Theme...
                </>
              ) : (
                <>💾 Save Global Theme</>
              )}
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {message && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3.5 text-sm text-emerald-600 dark:text-emerald-300">
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="text-xs font-bold opacity-70 hover:opacity-100">✕</button>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-3.5 text-sm text-rose-600 dark:text-rose-300">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-xs font-bold opacity-70 hover:opacity-100">✕</button>
          </div>
        )}

        {/* Current Active Banner */}
        <div
          className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5 shadow-sm transition-all"
          style={{
            backgroundColor: activeColors?.cardBg || "#ffffff",
            borderColor: activeColors?.border || "#e2e8f0",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-md"
              style={{
                background: activeColors?.gradient || activeColors?.primary,
                color: "#ffffff",
              }}
            >
              🎨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Current Active Theme:
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: themes[currentTheme]?.previewColor || "#7c3aed" }}
                >
                  {themes[currentTheme]?.name || currentTheme}
                </span>
                {selectedTheme !== currentTheme && (
                  <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-300">
                    Previewing unsaved: {themes[selectedTheme]?.name}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm" style={{ color: activeColors?.textSecondary || "#64748b" }}>
                Select any theme card below to instantly preview how your buttons, cards, gradients, and typography will look.
              </p>
            </div>
          </div>

          {selectedTheme !== currentTheme && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="rounded-xl border px-3.5 py-2 text-xs font-medium transition hover:bg-black/5 dark:hover:bg-white/10"
                style={{
                  borderColor: activeColors?.border || "#e2e8f0",
                  color: activeColors?.textSecondary || "#64748b",
                }}
              >
                ↺ Revert to Active
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-white shadow transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: activeColors?.primary || "#7c3aed" }}
              >
                Apply & Save Now
              </button>
            </div>
          )}
        </div>

        {/* Theme Cards Grid */}
        <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {themeOrder.map((themeKey) => {
            const item = themes[themeKey];
            if (!item) return null;
            const c = item.colors;
            const isCurrentActive = currentTheme === themeKey;
            const isSelected = selectedTheme === themeKey;

            return (
              <div
                key={themeKey}
                onClick={() => handleSelect(themeKey)}
                className={`group relative cursor-pointer rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isSelected
                    ? "ring-2 ring-offset-2"
                    : "hover:border-gray-400 dark:hover:border-gray-600"
                }`}
                style={{
                  backgroundColor: isSelected ? c.cardBg : activeColors?.cardBg || "#ffffff",
                  borderColor: isSelected ? c.primary : activeColors?.border || "#e2e8f0",
                  outlineColor: isSelected ? c.primary : "transparent",
                  boxShadow: isSelected
                    ? `0 12px 30px ${c.primary}25`
                    : "0 4px 12px rgba(0,0,0,0.03)",
                }}
              >
                {/* Badges */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-4 w-4 rounded-full border-2"
                      style={{
                        backgroundColor: item.previewColor,
                        borderColor: isSelected ? c.primary : "#ffffff",
                      }}
                    />
                    <h3 className="font-bold text-base" style={{ color: isSelected ? c.text : activeColors?.text }}>
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isCurrentActive && (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Active
                      </span>
                    )}
                    {isSelected && !isCurrentActive && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                        style={{ backgroundColor: c.primary }}
                      >
                        Preview
                      </span>
                    )}
                  </div>
                </div>

                <p
                  className="mb-4 text-xs leading-relaxed line-clamp-2"
                  style={{ color: isSelected ? c.textSecondary : activeColors?.textSecondary }}
                >
                  {item.description}
                </p>

                {/* Mini Visual Sandbox Preview inside card */}
                <div
                  className="mb-4 rounded-xl border p-3.5 transition-all"
                  style={{
                    backgroundColor: c.background,
                    borderColor: c.border,
                  }}
                >
                  {/* Fake Header */}
                  <div
                    className="mb-2.5 flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-semibold border"
                    style={{
                      backgroundColor: c.cardBg,
                      borderColor: c.border,
                      color: c.text,
                    }}
                  >
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.primary }} />
                      Portfolio
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] text-white"
                      style={{ backgroundColor: c.primary }}
                    >
                      Hire Me
                    </span>
                  </div>

                  {/* Fake Card with Gradient Accent */}
                  <div
                    className="rounded-lg p-2.5 text-[11px] border shadow-xs"
                    style={{
                      backgroundColor: c.cardBg,
                      borderColor: c.border,
                      color: c.text,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Full-Stack Project</span>
                      <span
                        className="rounded px-1.5 py-0.5 text-[9px] font-medium"
                        style={{ backgroundColor: c.badgeBg || c.primaryLight, color: c.badgeText || c.primaryDark }}
                      >
                        React & Node
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <div
                        className="h-1.5 w-12 rounded-full"
                        style={{ background: c.gradient || c.primary }}
                      />
                      <div
                        className="h-1.5 w-6 rounded-full opacity-40"
                        style={{ backgroundColor: c.accent }}
                      />
                    </div>
                  </div>
                </div>

                {/* Palette Swatches */}
                <div className="mb-4 flex items-center justify-between pt-1">
                  <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    Palette:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      title="Primary"
                      className="h-4 w-4 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: c.primary }}
                    />
                    <span
                      title="Accent"
                      className="h-4 w-4 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: c.accent }}
                    />
                    <span
                      title="Background"
                      className="h-4 w-4 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: c.background }}
                    />
                    <span
                      title="Card Surface"
                      className="h-4 w-4 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: c.cardBg }}
                    />
                  </div>
                </div>

                {/* Card Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(themeKey);
                  }}
                  className="w-full rounded-xl py-2 text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: isSelected ? c.primary : "transparent",
                    color: isSelected ? "#ffffff" : activeColors?.textSecondary,
                    border: `1px solid ${isSelected ? c.primary : activeColors?.border || "#e2e8f0"}`,
                  }}
                >
                  {isCurrentActive
                    ? "✓ Currently Active"
                    : isSelected
                    ? "✓ Applied to Website"
                    : "Select & Apply Theme"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Live Interactive Sandbox Preview */}
        <div
          className="rounded-2xl border p-7 shadow-sm transition-all"
          style={{
            backgroundColor: activeColors?.cardBg || "#ffffff",
            borderColor: activeColors?.border || "#e2e8f0",
          }}
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b pb-4" style={{ borderColor: activeColors?.border }}>
            <div>
              <h2 className="text-xl font-bold tracking-tight" style={{ color: activeColors?.text }}>
                Live Component Preview
              </h2>
              <p className="mt-0.5 text-xs" style={{ color: activeColors?.textSecondary }}>
                This section demonstrates how hero text, buttons, tags, and cards appear in the selected theme ({themes[selectedTheme]?.name}).
              </p>
            </div>
            <span
              className="rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm"
              style={{ backgroundColor: activeColors?.primary }}
            >
              {themes[selectedTheme]?.name}
            </span>
          </div>

          <div
            className="rounded-2xl border p-8 transition-all"
            style={{
              backgroundColor: activeColors?.background,
              borderColor: activeColors?.border,
            }}
          >
            {/* Hero Mockup */}
            <div className="max-w-2xl">
              <span
                className="inline-block rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: activeColors?.badgeBg || activeColors?.primaryLight,
                  color: activeColors?.badgeText || activeColors?.primaryDark,
                }}
              >
                👋 Welcome to my portfolio
              </span>

              <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl" style={{ color: activeColors?.text }}>
                Hi, I&apos;m Chandani{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: activeColors?.gradient || `linear-gradient(135deg, ${activeColors?.primary}, ${activeColors?.accent})`,
                  }}
                >
                  Kumari
                </span>
              </h1>

              <p className="mt-3 text-sm leading-relaxed" style={{ color: activeColors?.textSecondary }}>
                Full-Stack Developer passionate about building high-performance web applications, scalable database architectures, and intuitive digital interfaces.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  className="rounded-full px-6 py-2.5 text-xs font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: activeColors?.primary,
                    boxShadow: `0 8px 20px ${activeColors?.primary}40`,
                  }}
                >
                  Contact Me →
                </button>
                <button
                  className="rounded-full border px-5 py-2.5 text-xs font-semibold transition hover:bg-black/5 dark:hover:bg-white/10"
                  style={{
                    borderColor: activeColors?.border,
                    color: activeColors?.text,
                    backgroundColor: activeColors?.cardBg,
                  }}
                >
                  View Projects
                </button>
              </div>
            </div>

            {/* Quick Stats & Cards Mockup */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div
                className="rounded-xl border p-4 shadow-xs"
                style={{
                  backgroundColor: activeColors?.cardBg,
                  borderColor: activeColors?.border,
                }}
              >
                <p className="text-xs font-medium" style={{ color: activeColors?.textSecondary }}>Total Projects</p>
                <h4 className="mt-1 text-2xl font-bold" style={{ color: activeColors?.primary }}>3+</h4>
              </div>
              <div
                className="rounded-xl border p-4 shadow-xs"
                style={{
                  backgroundColor: activeColors?.cardBg,
                  borderColor: activeColors?.border,
                }}
              >
                <p className="text-xs font-medium" style={{ color: activeColors?.textSecondary }}>Certifications</p>
                <h4 className="mt-1 text-2xl font-bold" style={{ color: activeColors?.accent }}>11+</h4>
              </div>
              <div
                className="rounded-xl border p-4 shadow-xs"
                style={{
                  backgroundColor: activeColors?.cardBg,
                  borderColor: activeColors?.border,
                }}
              >
                <p className="text-xs font-medium" style={{ color: activeColors?.textSecondary }}>Global Theme</p>
                <h4 className="mt-1 text-lg font-bold" style={{ color: activeColors?.text }}>
                  {themes[selectedTheme]?.name}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
