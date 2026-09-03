import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await API.get("/admin/me");
        if (response.data.success) {
          navigate("/admin/dashboard");
        }
      } catch {
        // Not authenticated, stay on login page
        console.log("Not authenticated");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user types
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!formData.email || !formData.password) {
      setError("⚠️ Please enter both email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await API.post(
        "/admin/login",
        formData
      );

      if (response.data.success) {
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }
        
        navigate("/admin/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "❌ Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        
        {/* Main card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/20">
          
          {/* Logo / Icon */}
          <div className="mb-8 text-center">
            <div className="relative mb-4 inline-block">
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-4xl shadow-lg">
                👩‍💻
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-white/50">
              Sign in to manage your portfolio
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 animate-shake rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                  📧
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 hover:border-white/20"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-white/70">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/admin/forgot-password")}
                  className="text-xs text-white/30 transition hover:text-cyan-400"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                  🔒
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-12 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 hover:border-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white/60"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-white/50">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-white/10 bg-black/20 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                />
                Remember me
              </label>
              <span className="text-xs text-white/20">
                Secure login
              </span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Demo credentials hint */}
            <div className="mt-4 rounded-lg border border-white/5 bg-white/5 p-3 text-center">
              <p className="text-xs text-white/30">
                Demo: admin@example.com / password123
              </p>
            </div>

          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-white/20">
              Chandani Portfolio Admin Panel v1.0
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}