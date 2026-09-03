import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import { useTheme } from "../../context/ThemeContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { themeColors, currentTheme } = useTheme();

  const [admin, setAdmin] = useState(null);
  const [ setPortfolio] = useState(null); // ✅ FIXED: Proper state declaration
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    education: 0,
    skills: 0,
    certifications: 0,
    languages: 0,
    hobbies: 0,
  });

  // Theme color swatches
  const themeColorSwatches = {
    blue: '#08bde0',
    purple: '#7c3aed',
    green: '#059669',
    red: '#dc2626',
    orange: '#ea580c',
    dark: '#38bdf8',
  };

  const getThemeColor = () => {
    return themeColorSwatches[currentTheme] || themeColorSwatches.blue;
  };

  // ✅ Updated useEffect with AbortController for cleanup
  useEffect(() => {
    const abortController = new AbortController();

    const loadDashboard = async () => {
      try {
        setLoading(true);
        
        const [adminResponse, portfolioResponse] = await Promise.all([
          API.get("/admin/me", {
            signal: abortController.signal
          }),
          API.get("/portfolio", {
            signal: abortController.signal
          }),
        ]);

        // Check admin authentication
        if (!adminResponse.data.success) {
          navigate("/admin");
          return;
        }

        setAdmin(adminResponse.data.admin);

        // Load portfolio data
        if (portfolioResponse.data.success) {
          const data = portfolioResponse.data.data;
          setPortfolio(data); // ✅ Now this will work

          // Calculate statistics
          const projectCount = data.projects?.length || 0;
          const educationCount = data.education?.length || 0;
          const certificationCount = data.certifications?.length || 0;
          const languageCount = data.languages?.length || 0;
          const hobbyCount = data.hobbies?.length || 0;

          const skillCount = Object.values(data.skills || {}).reduce(
            (total, skills) => total + (Array.isArray(skills) ? skills.length : 0),
            0
          );

          setStats({
            projects: projectCount,
            education: educationCount,
            skills: skillCount,
            certifications: certificationCount,
            languages: languageCount,
            hobbies: hobbyCount,
          });
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Failed to load dashboard:", error);
          if (error.response?.status === 401) {
            navigate("/admin");
          }
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      abortController.abort();
    };
  }, [navigate]);

  // Logout function
  const handleLogout = async () => {
    try {
      await API.post("/admin/logout");
      navigate("/admin");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/admin");
    }
  };

  if (loading) {
    return (
      <div 
        className="flex min-h-screen items-center justify-center"
        style={{
          backgroundColor: themeColors?.background || '#0f172a',
          color: themeColors?.text || '#ffffff',
        }}
      >
        <div className="text-center">
          <div 
            className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
            style={{
              borderColor: `${getThemeColor()}40`,
              borderTopColor: getThemeColor(),
            }}
          />
          <p className="text-white/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: themeColors?.background || '#0f172a',
        color: themeColors?.text || '#ffffff',
      }}
    >
      <AdminSidebar />

      <main className="ml-64 min-h-screen p-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p 
              className="text-sm font-medium"
              style={{ color: getThemeColor() }}
            >
              ADMIN DASHBOARD
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              Welcome back, {admin?.name || "Chandani"} 👋
            </h1>
            <p 
              className="mt-2"
              style={{ color: themeColors?.textSecondary || '#94a3b8' }}
            >
              Manage your portfolio from one place.
            </p>
          </div>
          
          <div className="flex gap-3 items-center">
            <ThemeSwitcher />
            <button
              onClick={() => window.open("/", "_blank")}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10"
            >
              🌐 View Portfolio
            </button>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-500/20 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Stats Cards - Row 1 */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            icon="💼"
            title="Projects"
            value={stats.projects}
            onClick={() => navigate("/admin/projects")}
            color="cyan"
            themeColors={themeColors}
            themeColor={getThemeColor()}
          />

          <DashboardCard
            icon="🎓"
            title="Education"
            value={stats.education}
            onClick={() => navigate("/admin/education")}
            color="blue"
            themeColors={themeColors}
            themeColor={getThemeColor()}
          />

          <DashboardCard
            icon="⚡"
            title="Skills"
            value={stats.skills}
            onClick={() => navigate("/admin/skills")}
            color="purple"
            themeColors={themeColors}
            themeColor={getThemeColor()}
          />

          <DashboardCard
            icon="🏆"
            title="Certifications"
            value={stats.certifications}
            onClick={() => navigate("/admin/certifications")}
            color="yellow"
            themeColors={themeColors}
            themeColor={getThemeColor()}
          />
        </div>

        {/* Stats Cards - Row 2 */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            icon="🌐"
            title="Languages"
            value={stats.languages}
            onClick={() => navigate("/admin/languages")}
            color="green"
            themeColors={themeColors}
            themeColor={getThemeColor()}
          />

          <DashboardCard
            icon="🎨"
            title="Hobbies"
            value={stats.hobbies}
            onClick={() => navigate("/admin/hobbies")}
            color="pink"
            themeColors={themeColors}
            themeColor={getThemeColor()}
          />

          <DashboardCard
            icon="👤"
            title="Personal Info"
            value="Edit"
            onClick={() => navigate("/admin/personal")}
            color="indigo"
            themeColors={themeColors}
            themeColor={getThemeColor()}
          />

          <DashboardCard
            icon="📊"
            title="Total Items"
            value={Object.values(stats).reduce((a, b) => a + b, 0)}
            onClick={() => window.open("/", "_blank")}
            color="white"
            themeColors={themeColors}
            themeColor={getThemeColor()}
          />
        </div>

        {/* Quick Actions */}
        <div className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <span 
              className="text-xs"
              style={{ color: themeColors?.textSecondary || '#94a3b8' }}
            >
              v1.0
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <QuickAction
              icon="➕"
              title="Add Project"
              description="Create a new portfolio project"
              onClick={() => navigate("/admin/projects")}
              themeColors={themeColors}
              themeColor={getThemeColor()}
            />

            <QuickAction
              icon="🎓"
              title="Add Education"
              description="Add your education details"
              onClick={() => navigate("/admin/education")}
              themeColors={themeColors}
              themeColor={getThemeColor()}
            />

            <QuickAction
              icon="⚡"
              title="Manage Skills"
              description="Add or remove your skills"
              onClick={() => navigate("/admin/skills")}
              themeColors={themeColors}
              themeColor={getThemeColor()}
            />

            <QuickAction
              icon="🏆"
              title="Add Certification"
              description="Add your certifications"
              onClick={() => navigate("/admin/certifications")}
              themeColors={themeColors}
              themeColor={getThemeColor()}
            />

            <QuickAction
              icon="🌐"
              title="Manage Languages"
              description="Add or remove languages"
              onClick={() => navigate("/admin/languages")}
              themeColors={themeColors}
              themeColor={getThemeColor()}
            />

            <QuickAction
              icon="🎨"
              title="Manage Hobbies"
              description="Add or remove hobbies"
              onClick={() => navigate("/admin/hobbies")}
              themeColors={themeColors}
              themeColor={getThemeColor()}
            />
          </div>
        </div>

        {/* Portfolio Summary */}
        <div 
          className="mt-10 rounded-2xl border p-6"
          style={{
            borderColor: themeColors?.border || '#334155',
            backgroundColor: themeColors?.cardBg || '#1e293b',
          }}
        >
          <h3 className="mb-4 text-lg font-semibold">📈 Portfolio Summary</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-white/50">Total Projects</p>
              <p className="text-2xl font-bold" style={{ color: getThemeColor() }}>
                {stats.projects}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/50">Total Skills</p>
              <p className="text-2xl font-bold" style={{ color: getThemeColor() }}>
                {stats.skills}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/50">Total Certifications</p>
              <p className="text-2xl font-bold" style={{ color: getThemeColor() }}>
                {stats.certifications}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/50">Total Languages</p>
              <p className="text-2xl font-bold" style={{ color: getThemeColor() }}>
                {stats.languages}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ 
  icon, 
  title, 
  value, 
  onClick, 
  color = "cyan", 
  themeColors,
  themeColor 
}) {
  const colorClasses = {
    cyan: "border-cyan-400/20 hover:border-cyan-400/40",
    blue: "border-blue-400/20 hover:border-blue-400/40",
    purple: "border-purple-400/20 hover:border-purple-400/40",
    yellow: "border-yellow-400/20 hover:border-yellow-400/40",
    green: "border-green-400/20 hover:border-green-400/40",
    pink: "border-pink-400/20 hover:border-pink-400/40",
    indigo: "border-indigo-400/20 hover:border-indigo-400/40",
    white: "border-white/10 hover:border-white/20",
  };

  const iconColors = {
    cyan: "text-cyan-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
    yellow: "text-yellow-400",
    green: "text-green-400",
    pink: "text-pink-400",
    indigo: "text-indigo-400",
    white: "text-white/60",
  };

  return (
    <button
      onClick={onClick}
      className={`group rounded-2xl border p-6 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${colorClasses[color]}`}
      style={{
        backgroundColor: themeColors?.cardBg || 'rgba(255,255,255,0.05)',
        boxShadow: `0 4px 20px ${themeColor}10`,
      }}
    >
      <div className={`mb-4 text-3xl transition-transform duration-300 group-hover:scale-110 ${iconColors[color]}`}>
        {icon}
      </div>

      <p 
        className="text-sm"
        style={{ color: themeColors?.textSecondary || '#94a3b8' }}
      >
        {title}
      </p>

      <h3 
        className="mt-2 text-3xl font-bold"
        style={{ color: themeColors?.text || '#ffffff' }}
      >
        {value}
      </h3>
      
      <div 
        className="mt-3 h-0.5 w-0 rounded-full transition-all duration-300 group-hover:w-full"
        style={{ backgroundColor: themeColor }}
      />
    </button>
  );
}

function QuickAction({ icon, title, description, onClick, themeColors, themeColor }) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border p-6 text-left transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: themeColors?.cardBg || 'rgba(255,255,255,0.05)',
        borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = themeColor;
        e.currentTarget.style.boxShadow = `0 8px 30px ${themeColor}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = themeColors?.border || 'rgba(255,255,255,0.1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="mb-3 text-3xl transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      <h3 
        className="font-semibold transition-colors duration-300"
        style={{ color: themeColors?.text || '#ffffff' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = themeColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = themeColors?.text || '#ffffff';
        }}
      >
        {title}
      </h3>

      <p 
        className="mt-1 text-sm"
        style={{ color: themeColors?.textSecondary || '#94a3b8' }}
      >
        {description}
      </p>
    </button>
  );
}