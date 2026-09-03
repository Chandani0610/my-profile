import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";

const emptyCert = {
  name: "",
  issuer: "",
  credential: "",
  url: "",
};

export default function AdminCertifications() {
  const navigate = useNavigate();
  const { themeColors, currentTheme } = useTheme();

  const [certifications, setCertifications] = useState([]);
  const [form, setForm] = useState(emptyCert);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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

    const loadCertifications = async () => {
      try {
        setLoading(true);
        const response = await API.get("/portfolio", {
          signal: abortController.signal
        });

        if (response.data.success) {
          setCertifications(response.data.data.certifications || []);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Failed to load certifications:", error);
          setMessage("❌ Failed to load certifications.");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadCertifications();

    return () => {
      abortController.abort();
    };
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (message) setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.url && !isValidUrl(form.url)) {
      setMessage("⚠️ Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      if (editingId) {
        await API.put(`/admin/certifications/${editingId}`, form);
        setMessage("✅ Certification updated successfully.");
      } else {
        await API.post("/admin/certifications", form);
        setMessage("✅ Certification added successfully.");
      }

      setForm(emptyCert);
      setEditingId(null);
      
      const response = await API.get("/portfolio");
      if (response.data.success) {
        setCertifications(response.data.data.certifications || []);
      }

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "❌ Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const editCertification = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      issuer: item.issuer || "",
      credential: item.credential || "",
      url: item.url || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCertification = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this certification?"
    );
    if (!confirmed) return;

    setDeletingId(id);
    setMessage("");

    try {
      await API.delete(`/admin/certifications/${id}`);
      setMessage("✅ Certification deleted successfully.");
      
      const response = await API.get("/portfolio");
      if (response.data.success) {
        setCertifications(response.data.data.certifications || []);
      }

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "❌ Failed to delete certification."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyCert);
  };

  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p 
              className="text-sm font-medium"
              style={{ color: getThemeColor() }}
            >
              ADMIN / CERTIFICATIONS
            </p>
            <h1 className="mt-2 text-3xl font-bold">Manage Certifications</h1>
            <p 
              className="mt-1 text-sm"
              style={{ color: themeColors?.textSecondary || '#94a3b8' }}
            >
              {certifications.length} certification{certifications.length !== 1 ? 's' : ''} in your portfolio
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="rounded-xl border px-4 py-2 text-sm transition hover:bg-white/10"
            style={{
              borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
              color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)',
            }}
          >
            ← Dashboard
          </button>
        </div>

        {message && (
          <div 
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              message.includes("✅") 
                ? "border-green-400/20 bg-green-400/10 text-green-300"
                : message.includes("⚠️")
                ? "border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
                : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
            }`}
          >
            {message}
          </div>
        )}

        <div 
          className="mb-10 rounded-2xl border p-6"
          style={{
            borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
            backgroundColor: themeColors?.cardBg || 'rgba(255,255,255,0.05)',
          }}
        >
          <h2 className="mb-6 text-xl font-semibold">
            {editingId ? "✏️ Edit Certification" : "➕ Add New Certification"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Certification Name <span className="text-cyan-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="AWS Certified Developer"
                required
                className="w-full rounded-xl border px-4 py-3 outline-none transition placeholder:text-gray-400 focus:ring-2"
                style={{
                  borderColor: '#d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = getThemeColor();
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${getThemeColor()}30`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Issuer <span className="text-cyan-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="issuer"
                value={form.issuer}
                onChange={handleChange}
                placeholder="Amazon Web Services"
                required
                className="w-full rounded-xl border px-4 py-3 outline-none transition placeholder:text-gray-400 focus:ring-2"
                style={{
                  borderColor: '#d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = getThemeColor();
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${getThemeColor()}30`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Credential ID
              </label>
              <input
                type="text"
                name="credential"
                value={form.credential}
                onChange={handleChange}
                placeholder="AWS-12345"
                className="w-full rounded-xl border px-4 py-3 outline-none transition placeholder:text-gray-400 focus:ring-2"
                style={{
                  borderColor: '#d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = getThemeColor();
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${getThemeColor()}30`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                URL
              </label>
              <input
                type="url"
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://credential.com/verify/12345"
                className="w-full rounded-xl border px-4 py-3 outline-none transition placeholder:text-gray-400 focus:ring-2"
                style={{
                  borderColor: '#d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = getThemeColor();
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${getThemeColor()}30`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl px-6 py-3 font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: getThemeColor(),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.85';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {saving ? (
                  <>
                    <span className="inline-block h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {editingId ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingId ? "Update Certification" : "Add Certification"
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-xl border px-6 py-3 transition hover:bg-gray-100"
                  style={{
                    borderColor: '#d1d5db',
                    color: '#6b7280',
                    backgroundColor: '#ffffff',
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-4 border-t pt-4" style={{ borderColor: themeColors?.border || 'rgba(255,255,255,0.05)' }}>
            <p className="text-xs" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.2)' }}>
              Certifications are displayed on the portfolio's Certifications section.
            </p>
          </div>
        </div>

        {/* CERTIFICATIONS LIST - WHITE CARDS WITH DARK TEXT */}
        <div 
          className="rounded-2xl border p-6"
          style={{
            borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
            backgroundColor: themeColors?.cardBg || 'rgba(255,255,255,0.05)',
          }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Certifications</h2>
            {!loading && certifications.length > 0 && (
              <span 
                className="rounded-full px-3 py-1 text-xs"
                style={{
                  backgroundColor: `${getThemeColor()}20`,
                  color: getThemeColor(),
                }}
              >
                {certifications.length} total
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div 
                  className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
                  style={{
                    borderColor: `${getThemeColor()}40`,
                    borderTopColor: getThemeColor(),
                  }}
                />
                <p className="text-white/50">Loading certifications...</p>
              </div>
            </div>
          ) : certifications.length === 0 ? (
            <div 
              className="rounded-xl border p-8 text-center"
              style={{
                borderColor: '#d1d5db',
                backgroundColor: '#ffffff',
              }}
            >
              <p className="text-gray-500">No certifications found. Add your first certification above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {certifications.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border p-5 transition shadow-sm hover:shadow-md md:flex-row md:items-center md:justify-between"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                  }}
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                      {item.credential && (
                        <span className="ml-2 text-xs text-gray-400">
                          #{item.credential}
                        </span>
                      )}
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: getThemeColor() }}>
                      {item.issuer}
                    </p>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-sm transition hover:text-gray-700"
                        style={{ color: '#6b7280' }}
                      >
                        🔗 Verify Credential
                      </a>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg px-4 py-2 text-sm font-medium transition"
                        style={{
                          backgroundColor: '#dcfce7',
                          color: '#16a34a',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#bbf7d0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#dcfce7';
                        }}
                      >
                        View
                      </a>
                    )}
                    <button
                      onClick={() => editCertification(item)}
                      className="rounded-lg px-4 py-2 text-sm font-medium transition"
                      style={{
                        backgroundColor: '#dbeafe',
                        color: '#2563eb',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#bfdbfe';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#dbeafe';
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCertification(item.id)}
                      disabled={deletingId === item.id}
                      className="rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50"
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fecaca';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fee2e2';
                      }}
                    >
                      {deletingId === item.id ? (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}