import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import API from "../../services/api";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { themeColors, currentTheme } = useTheme();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "📊",
    },
    {
      name: "Personal Info",
      path: "/admin/personal",
      icon: "👤",
    },
    {
      name: "Projects",
      path: "/admin/projects",
      icon: "💼",
    },
    {
      name: "Education",
      path: "/admin/education",
      icon: "🎓",
    },
    {
      name: "Skills",
      path: "/admin/skills",
      icon: "⚡",
    },
    {
      name: "Certifications",
      path: "/admin/certifications",
      icon: "🏆",
    },
    {
      name: "Languages",
      path: "/admin/languages",
      icon: "🌐",
    },
    {
      name: "Hobbies",
      path: "/admin/hobbies",
      icon: "🎯",
    },
    {
      name: "Website Theme",
      path: "/admin/theme",
      icon: "🎨",
    },
  ];

  const handleLogout = async () => {
    try {
      await API.post("/admin/logout");
    } catch (error) {
      console.error(error);
    }

    navigate("/admin");
  };

  return (
    <aside 
      className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r transition-colors duration-300"
      style={{
        backgroundColor: themeColors?.background || '#0f172a',
        borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
      }}
    >
      {/* Logo */}
      <div 
        className="border-b px-6 py-6 transition-colors duration-300"
        style={{
          borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
        }}
      >
        <h1 
          className="text-xl font-bold transition-colors duration-300"
          style={{ color: themeColors?.text || '#ffffff' }}
        >
          Portfolio
        </h1>

        <p 
          className="mt-1 text-xs transition-colors duration-300"
          style={{ color: themeColors?.primary || '#3b82f6' }}
        >
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                isActive
                  ? "shadow-lg"
                  : "hover:bg-white/5"
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive 
                ? themeColors?.primary || '#3b82f6'
                : 'transparent',
              color: isActive 
                ? '#ffffff'
                : themeColors?.textSecondary || 'rgba(255,255,255,0.6)',
              boxShadow: isActive 
                ? `0 4px 20px ${themeColors?.primary}40`
                : 'none',
            })}
          >
            {({ isActive }) => (
              <>
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
                {item.path === "/admin/dashboard" && (
                  <span 
                    className="ml-auto text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                      color: isActive ? '#ffffff' : themeColors?.textSecondary,
                    }}
                  >
                    v1
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div 
        className="border-t p-4 transition-colors duration-300"
        style={{
          borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
        }}
      >
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 hover:bg-red-500/10"
          style={{
            color: '#f87171',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>

        {/* Theme indicator */}
        <button
          onClick={() => navigate("/admin/theme")}
          className="mt-3 flex w-full items-center justify-between rounded-lg px-2 py-1.5 transition hover:bg-white/5"
        >
          <span 
            className="text-xs"
            style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.4)' }}
          >
            🎨 Theme
          </span>
          <div 
            className="flex items-center gap-2"
          >
            <div 
              className="h-3 w-3 rounded-full border"
              style={{
                backgroundColor: themeColors?.primary || '#3b82f6',
                borderColor: themeColors?.border || 'rgba(255,255,255,0.2)',
              }}
            />
            <span 
              className="text-xs capitalize font-medium"
              style={{ color: themeColors?.primary || '#3b82f6' }}
            >
              {currentTheme || 'purple'}
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
}