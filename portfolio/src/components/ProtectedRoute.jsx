// components/ProtectedRoute.jsx
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import API, { clearAuthToken } from "../services/api";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("admin_authenticated") === "true";
  });
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      try {
        const res = await API.get("/admin/me");
        if (res.data?.success && isMounted) {
          setIsAuthenticated(true);
          localStorage.setItem("admin_authenticated", "true");
        } else if (isMounted) {
          setIsAuthenticated(false);
          clearAuthToken();
        }
      } catch (err) {
        if (isMounted) {
          console.warn("Admin session verification failed:", err.message);
          setIsAuthenticated(false);
          clearAuthToken();
        }
      } finally {
        if (isMounted) {
          setChecking(false);
        }
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b14] text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-purple-500" />
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
          </div>
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Verifying Admin Security Gateway...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to /admin login with current location preserved
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
}
