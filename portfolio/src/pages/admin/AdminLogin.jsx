import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound, Sparkles } from "lucide-react";
import API, { setAuthToken } from "../../services/api";

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
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please provide both email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/admin/login", formData);

      if (response.data.success) {
        if (response.data.token) {
          setAuthToken(response.data.token);
        } else {
          localStorage.setItem("admin_authenticated", "true");
        }
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Authentication failed. Please verify your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#070b14] px-4 py-12 text-slate-100 overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[150px]" />
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Back to Live Portfolio link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#0d1527]/70 px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md transition-all hover:border-purple-500/40 hover:bg-[#131f38] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 text-purple-400" />
          Back to Live Portfolio
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Main Card */}
        <div className="rounded-3xl border border-white/10 bg-[#0d1527]/85 p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition-all duration-300">
          
          {/* Header & Logo */}
          <div className="mb-8 text-center">
            <div className="relative mb-5 inline-block">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 opacity-60 blur-lg transition duration-500 hover:opacity-100" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-[#0a0f1d] shadow-2xl">
                <KeyRound className="h-8 w-8 text-purple-400" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-purple-300 mb-3">
              <Sparkles className="h-3 w-3 text-purple-400 animate-pulse" />
              Admin Portal
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome Back
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Sign in with your master credentials to manage portfolio
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
              <ShieldCheck className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/10 bg-[#070b14]/80 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Master Password
                </label>
                <Link
                  to="/admin/forgot-password"
                  className="text-xs text-purple-400 transition hover:text-purple-300 hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/10 bg-[#070b14]/80 pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition hover:text-slate-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-400 transition hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-white/10 bg-[#070b14] text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                />
                Remember me
              </label>
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                256-bit SSL Encrypted
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-[length:200%_auto] px-4 py-3.5 font-semibold text-white shadow-lg shadow-purple-600/25 transition-all duration-300 hover:bg-[position:right_center] hover:shadow-purple-600/40 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2 text-sm">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 text-sm">
                  <span>Access Admin Console</span>
                </span>
              )}
            </button>
          </form>


          {/* Version / Copyright */}
          <div className="mt-6 text-center text-[11px] text-slate-500">
            Chandani Portfolio Console • Security v2.4
          </div>
        </div>
      </div>
    </div>
  );
}
