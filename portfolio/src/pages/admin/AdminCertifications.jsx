import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import API, { getImageUrl } from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";

const emptyCert = {
  certification_name: "",
  name: "",
  issuer: "",
  credential: "",
  image: "",
};

export default function AdminCertifications() {
  const navigate = useNavigate();
  const { themeColors, currentTheme } = useTheme();
  const fileInputRef = useRef(null);

  // State for CRUD operations
  const [certifications, setCertifications] = useState([]);
  const [form, setForm] = useState(emptyCert);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("certification_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [viewMode, setViewMode] = useState("list");

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

  // Show message helper
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  // READ - Load certifications
  const loadCertifications = async () => {
    try {
      setLoading(true);
      const response = await API.get("/admin/certifications");

      if (response.data.success) {
        let certs = response.data.data || [];
        
        if (Array.isArray(certs)) {
          certs = certs.filter(cert => cert != null).map(cert => ({
            ...cert,
            name: cert.name || cert.certification_name || "",
            certification_name: cert.certification_name || cert.name || "",
          }));
        } else {
          certs = [];
        }
        
        setCertifications(certs);
      } else {
        setCertifications([]);
      }
    } catch (error) {
      console.error("Failed to load certifications:", error);
      showMessage("❌ Failed to load certifications.", "error");
      setCertifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadCertifications();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  // HANDLE FORM INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (message) setMessage("");
  };

  // IMAGE UPLOAD - Supports all image formats and PDF
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type - accept images and PDF
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'application/pdf'
    ];
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf'];

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      showMessage("⚠️ Please upload an image file (JPG, PNG, GIF, WEBP, SVG) or PDF.", "warning");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showMessage("⚠️ File size must be less than 10MB.", "warning");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Create preview for images only
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDF, show a PDF icon
      setImagePreview('/pdf-icon.png'); // You can use a default PDF icon
    }

    setUploadingImage(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await API.post('/admin/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setForm(prev => ({
          ...prev,
          image: response.data.data.url
        }));
        showMessage("✅ File uploaded successfully!", "success");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showMessage(
        error.response?.data?.message || "❌ Failed to upload file.",
        "error"
      );
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = () => {
    setForm(prev => ({
      ...prev,
      image: ""
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // CREATE - Add new certification
  const handleCreate = async () => {
    const certTitle = (form.certification_name || form.name || "").trim();
    if (!certTitle) {
      showMessage("⚠️ Please enter a certification name.", "warning");
      return false;
    }

    setSaving(true);
    setMessage("");

    try {
      const payload = {
        name: certTitle,
        certification_name: certTitle,
        issuer: form.issuer?.trim() || "Self",
        credential: form.credential?.trim() || "",
        image: form.image || "",
      };

      const response = await API.post("/admin/certifications", payload);
      
      if (response.data.success) {
        showMessage("✅ Certification added successfully!", "success");
        setForm(emptyCert);
        setImagePreview(null);
        await loadCertifications();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Create error:", error);
      const errorMsg = error.response?.data?.message || "❌ Failed to create certification.";
      showMessage(errorMsg, "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // UPDATE - Edit existing certification
  const handleUpdate = async () => {
    const certTitle = (form.certification_name || form.name || "").trim();
    if (!certTitle) {
      showMessage("⚠️ Please enter a certification name.", "warning");
      return false;
    }

    setSaving(true);
    setMessage("");

    try {
      const payload = {
        name: certTitle,
        certification_name: certTitle,
        issuer: form.issuer?.trim() || "Self",
        credential: form.credential?.trim() || "",
        image: form.image || "",
      };

      const response = await API.put(`/admin/certifications/${editingId}`, payload);
      
      if (response.data.success) {
        showMessage("✅ Certification updated successfully!", "success");
        setForm(emptyCert);
        setEditingId(null);
        setImagePreview(null);
        await loadCertifications();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Update error:", error);
      const errorMsg = error.response?.data?.message || "❌ Failed to update certification.";
      showMessage(errorMsg, "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // DELETE - Remove certification
  const handleDelete = async (id) => {
    if (!id) return false;
    
    const confirmed = window.confirm(
      "Are you sure you want to delete this certification?\nThis action cannot be undone."
    );
    if (!confirmed) return false;

    setDeletingId(id);
    setMessage("");

    try {
      const response = await API.delete(`/admin/certifications/${id}`);
      
      if (response.data.success) {
        showMessage("✅ Certification deleted successfully.", "success");
        await loadCertifications();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Delete error:", error);
      showMessage(
        error.response?.data?.message || "❌ Failed to delete certification.",
        "error"
      );
      return false;
    } finally {
      setDeletingId(null);
    }
  };

  // BULK DELETE
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      showMessage("⚠️ Please select certifications to delete.", "warning");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} certification(s)?\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      for (const id of selectedIds) {
        await API.delete(`/admin/certifications/${id}`);
      }
      showMessage(`✅ ${selectedIds.length} certification(s) deleted successfully.`, "success");
      await loadCertifications();
      setSelectedIds([]);
    } catch (error) {
      console.error("Bulk delete error:", error);
      showMessage("❌ Failed to delete some certifications.", "error");
    } finally {
      setLoading(false);
    }
  };

  // DUPLICATE
  const handleDuplicate = async (item) => {
    if (!item) return;

    try {
      const title = item.certification_name || item.name || "Certification";
      const duplicateData = {
        name: `${title} (Copy)`,
        certification_name: `${title} (Copy)`,
        issuer: item.issuer || "Self",
        credential: item.credential || "",
        image: item.image || "",
      };

      const response = await API.post("/admin/certifications", duplicateData);
      
      if (response.data.success) {
        showMessage("✅ Certification duplicated successfully!", "success");
        await loadCertifications();
      }
    } catch (error) {
      console.error("Duplicate error:", error);
      showMessage("❌ Failed to duplicate certification.", "error");
    }
  };

  // FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let success;
    if (editingId) {
      success = await handleUpdate();
    } else {
      success = await handleCreate();
    }

    if (success) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // EDIT
  const editCertification = (item) => {
    if (!item) return;
    
    setEditingId(item.id);
    setForm({
      certification_name: item.certification_name || item.name || "",
      name: item.name || item.certification_name || "",
      issuer: item.issuer || "",
      credential: item.credential || "",
      image: item.image || "",
    });
    if (item.image) {
      setImagePreview(item.image);
    } else {
      setImagePreview(null);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyCert);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // SEARCH, SORT, PAGINATION
  const getFilteredCertifications = () => {
    let filtered = [...certifications];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(cert => 
        (cert.certification_name || cert.name || "")?.toLowerCase().includes(term) ||
        (cert.issuer || "")?.toLowerCase().includes(term) ||
        (cert.credential || "")?.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => {
      const aVal = (a[sortBy] || a.certification_name || a.name || "").toString().toLowerCase();
      const bVal = (b[sortBy] || b.certification_name || b.name || "").toString().toLowerCase();
      if (sortOrder === "asc") {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });

    return filtered;
  };

  const filteredCerts = getFilteredCertifications();
  const totalPages = Math.ceil(filteredCerts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCerts = filteredCerts.slice(startIndex, startIndex + itemsPerPage);

  // SELECT ALL
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(currentCerts.map(cert => cert.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // EXPORT
  const exportData = () => {
    try {
      const dataStr = JSON.stringify(certifications, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `certifications_${new Date().toISOString().slice(0,10)}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      showMessage("✅ Data exported successfully!", "success");
    } catch (error) {
      console.error("Export error:", error);
      showMessage("❌ Failed to export data.", "error");
    }
  };

  // IMPORT
  const importData = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          if (!Array.isArray(importedData)) {
            showMessage("⚠️ Invalid data format. Expected array.", "warning");
            return;
          }

          const confirmed = window.confirm(
            `This will add ${importedData.length} certification(s). Continue?`
          );
          if (!confirmed) return;

          setIsImporting(true);
          for (const cert of importedData) {
            await API.post("/admin/certifications", {
              certification_name: cert.certification_name || "Imported Certification",
              image: cert.image || "",
            });
          }
          showMessage(`✅ ${importedData.length} certification(s) imported successfully!`, "success");
          await loadCertifications();
        } catch (parseError) {
          console.error("Parse error:", parseError);
          showMessage("❌ Failed to parse imported file.", "error");
        } finally {
          setIsImporting(false);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error("Import error:", error);
      showMessage("❌ Failed to import data.", "error");
    } finally {
      e.target.value = '';
    }
  };

  // Get message styles
  const getMessageStyles = () => {
    switch (messageType) {
      case "success":
        return "border-green-400/20 bg-green-400/10 text-green-300";
      case "warning":
        return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
      case "error":
        return "border-red-400/20 bg-red-400/10 text-red-300";
      default:
        return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
    }
  };

  const hasCertifications = Array.isArray(certifications) && certifications.length > 0;

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
        {/* Header Section */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
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
              {hasCertifications ? `${certifications.length} certification${certifications.length !== 1 ? 's' : ''} in your portfolio` : 'No certifications in your portfolio'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {hasCertifications && (
              <button
                onClick={exportData}
                className="rounded-xl border px-4 py-2 text-sm transition hover:bg-white/10"
                style={{
                  borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
                  color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)',
                }}
              >
                📤 Export
              </button>
            )}
            <label
              className={`rounded-xl border px-4 py-2 text-sm transition hover:bg-white/10 cursor-pointer ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
                color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)',
              }}
            >
              {isImporting ? '⏳ Importing...' : '📥 Import'}
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
                disabled={isImporting}
              />
            </label>
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
        </div>

        {/* Message Display */}
        {message && (
          <div 
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${getMessageStyles()}`}
          >
            {message}
          </div>
        )}

        {/* Create/Edit Form */}
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

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Certification Name <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="certification_name"
                value={form.certification_name || form.name || ""}
                onChange={handleChange}
                placeholder="e.g., AWS Certified Developer, NPTEL - DBMS"
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                  Issuing Organization
                </label>
                <input
                  type="text"
                  name="issuer"
                  value={form.issuer || ""}
                  onChange={handleChange}
                  placeholder="e.g., HackerRank, NPTEL, Coursera"
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
                  Credential ID (Optional)
                </label>
                <input
                  type="text"
                  name="credential"
                  value={form.credential || ""}
                  onChange={handleChange}
                  placeholder="e.g., FBCED9F0E3A3"
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
            </div>

            {/* Image Upload Section - Supports all formats */}
            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Certification Image / Logo
                <span className="ml-2 text-xs text-gray-400">
                  (JPG, PNG, GIF, WEBP, SVG, PDF up to 10MB)
                </span>
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold"
                  style={{
                    borderColor: '#d1d5db',
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                  }}
                />
                {(form.image || imagePreview) && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    style={{
                      backgroundColor: '#fee2e2',
                    }}
                  >
                    Remove File
                  </button>
                )}
              </div>
              {uploadingImage && (
                <p className="mt-2 text-sm text-cyan-400">Uploading file...</p>
              )}
              {(form.image || imagePreview) && (
                <div className="mt-3">
                  {imagePreview && (
                    <img
                      src={getImageUrl(imagePreview)}
                      alt="Certification preview"
                      className="max-h-32 rounded-lg object-contain"
                      onError={(e) => {
                        e.target.src = '/file-icon.png';
                      }}
                    />
                  )}
                  <p className="mt-1 text-xs text-gray-400 truncate max-w-md">
                    {form.image || 'File uploaded'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving || uploadingImage}
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
              Supported formats: JPG, JPEG, PNG, GIF, WEBP, SVG, PDF (max 10MB)
            </p>
          </div>
        </div>

        {/* LIST SECTION */}
        <div 
          className="rounded-2xl border p-6"
          style={{
            borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
            backgroundColor: themeColors?.cardBg || 'rgba(255,255,255,0.05)',
          }}
        >
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold">Your Certifications</h2>
              {!loading && hasCertifications && (
                <span 
                  className="rounded-full px-3 py-1 text-xs"
                  style={{
                    backgroundColor: `${getThemeColor()}20`,
                    color: getThemeColor(),
                  }}
                >
                  {filteredCerts.length} total
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label
                className="flex items-center gap-2 text-sm"
                style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}
              >
                <input
                  type="checkbox"
                  checked={currentCerts.length > 0 && currentCerts.every(cert => selectedIds.includes(cert.id))}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                />
                Select all
              </label>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search certifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-xl border px-4 py-2 pl-9 text-sm outline-none transition focus:ring-2"
                  style={{
                    borderColor: '#d1d5db',
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    minWidth: '200px',
                  }}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border px-4 py-2 text-sm outline-none transition focus:ring-2"
                style={{
                  borderColor: '#d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                }}
              >
                <option value="certification_name">Sort by Name</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="rounded-xl border px-4 py-2 text-sm transition hover:bg-white/10"
                style={{
                  borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
                  color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)',
                }}
              >
                {sortOrder === "asc" ? "↑ A-Z" : "↓ Z-A"}
              </button>

              {/* View Mode Toggle */}
              <button
                onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                className="rounded-xl border px-4 py-2 text-sm transition hover:bg-white/10"
                style={{
                  borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
                  color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)',
                }}
              >
                {viewMode === "list" ? "⊞ Grid" : "☰ List"}
              </button>

              {/* Bulk Delete */}
              {selectedIds.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  style={{
                    backgroundColor: '#fee2e2',
                  }}
                >
                  🗑 Delete Selected ({selectedIds.length})
                </button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div 
                  className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
                  style={{
                    borderColor: `${getThemeColor()}40`,
                    borderTopColor: getThemeColor(),
                  }}
                />
                <p className="text-white/50">Loading certifications...</p>
              </div>
            </div>
          ) : !hasCertifications ? (
            <div 
              className="rounded-xl border p-12 text-center"
              style={{
                borderColor: '#d1d5db',
                backgroundColor: '#ffffff',
              }}
            >
              <div className="text-6xl mb-4">📜</div>
              <p className="text-gray-500">No certifications found. Add your first certification above!</p>
            </div>
          ) : filteredCerts.length === 0 ? (
            <div 
              className="rounded-xl border p-12 text-center"
              style={{
                borderColor: '#d1d5db',
                backgroundColor: '#ffffff',
              }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500">No certifications match your search.</p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-sm text-cyan-600 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <>
              {/* Certification List */}
              <div className={viewMode === "list" ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
                {currentCerts.map((item, index) => {
                  if (!item) return null;
                  
                  const isSelected = selectedIds.includes(item.id);
                  
                  return (
                    <div
                      key={item.id || `certification-${index}`}
                      className={`rounded-xl border p-5 transition shadow-sm hover:shadow-md ${
                        isSelected ? 'ring-2 ring-cyan-400' : ''
                      } ${viewMode === "list" ? "flex flex-col md:flex-row md:items-center md:justify-between gap-4" : "flex flex-col"}`}
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: isSelected ? '#08bde0' : '#e5e7eb',
                      }}
                    >
                      <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
                        <div className={`flex items-start ${viewMode === "list" ? "gap-4" : "gap-3"}`}>
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelect(item.id)}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                          />
                          
                          <div className="flex-1">
                            <div className={`flex items-center ${viewMode === "grid" ? "flex-col text-center" : "gap-4"}`}>
                              {item.image && (
                                <img
                                  src={getImageUrl(item.image)}
                                  alt={item.certification_name || item.name}
                                  className={`${viewMode === "grid" ? "h-16 w-16" : "h-12 w-12"} rounded-lg object-contain`}
                                  onError={(e) => {
                                    e.target.src = '/file-icon.png';
                                  }}
                                />
                              )}
                              <div className={viewMode === "grid" ? "mt-2" : ""}>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {item.certification_name || item.name || "Untitled Certification"}
                                </h3>
                                {item.issuer && (
                                  <p className="text-sm font-medium text-gray-600 mt-0.5">
                                    🏢 {item.issuer}
                                  </p>
                                )}
                                {item.credential && (
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    ID: {item.credential}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className={`flex flex-wrap gap-2 ${viewMode === "grid" ? "mt-4 justify-center" : ""}`}>
                        <button
                          onClick={() => handleDuplicate(item)}
                          className="rounded-lg px-4 py-2 text-sm font-medium transition"
                          style={{
                            backgroundColor: '#fef3c7',
                            color: '#d97706',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fde68a';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fef3c7';
                          }}
                        >
                          📋 Duplicate
                        </button>
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
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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
                            "🗑 Delete"
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="rounded-lg px-3 py-2 text-sm transition disabled:opacity-50"
                    style={{
                      backgroundColor: themeColors?.cardBg || 'rgba(255,255,255,0.05)',
                      border: `1px solid ${themeColors?.border || 'rgba(255,255,255,0.1)'}`,
                      color: themeColors?.text || '#ffffff',
                    }}
                  >
                    ⟪
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg px-4 py-2 text-sm transition disabled:opacity-50"
                    style={{
                      backgroundColor: themeColors?.cardBg || 'rgba(255,255,255,0.05)',
                      border: `1px solid ${themeColors?.border || 'rgba(255,255,255,0.1)'}`,
                      color: themeColors?.text || '#ffffff',
                    }}
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-2 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg px-4 py-2 text-sm transition disabled:opacity-50"
                    style={{
                      backgroundColor: themeColors?.cardBg || 'rgba(255,255,255,0.05)',
                      border: `1px solid ${themeColors?.border || 'rgba(255,255,255,0.1)'}`,
                      color: themeColors?.text || '#ffffff',
                    }}
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="rounded-lg px-3 py-2 text-sm transition disabled:opacity-50"
                    style={{
                      backgroundColor: themeColors?.cardBg || 'rgba(255,255,255,0.05)',
                      border: `1px solid ${themeColors?.border || 'rgba(255,255,255,0.1)'}`,
                      color: themeColors?.text || '#ffffff',
                    }}
                  >
                    ⟫
                  </button>
                </div>
              )}

              {/* Stats Footer */}
              <div className="mt-4 flex flex-wrap justify-between items-center gap-2 text-xs" style={{ color: themeColors?.textSecondary || '#94a3b8' }}>
                <span>
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCerts.length)} of {filteredCerts.length} certifications
                </span>
                {selectedIds.length > 0 && (
                  <span>
                    {selectedIds.length} selected
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}