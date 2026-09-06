import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";

const emptyEducation = {
  degree: "",
  college: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  isCurrent: false,
  marks: "",
};

export default function AdminEducation() {
  const navigate = useNavigate();
  const { themeColors, currentTheme } = useTheme();

  // State for CRUD operations
  const [education, setEducation] = useState([]);
  const [form, setForm] = useState(emptyEducation);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("year");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);

  // Month options
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Year options (current year - 30 years to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 31 }, (_, i) => currentYear - 30 + i);

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

  // READ - Load education
  const loadEducation = async () => {
    try {
      setLoading(true);
      const response = await API.get("/portfolio");

      if (response.data.success) {
        let eduData = response.data.data.education || [];
        
        if (Array.isArray(eduData)) {
          eduData = eduData.filter(item => item != null);
        } else {
          eduData = [];
        }
        
        // Ensure each education entry has an ID and proper field mapping
        eduData = eduData.map((item, index) => ({
          ...item,
          id: item.id || `edu-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
          college: item.college || item.institution || "",
          marks: item.marks || item.score || "",
        }));
        
        setEducation(eduData);
      } else {
        setEducation([]);
      }
    } catch (error) {
      console.error("Failed to load education:", error);
      showMessage("❌ Failed to load education.", "error");
      setEducation([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadEducation();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // HANDLE FORM INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
    if (message) setMessage("");
  };

  // Format year for display (combines start and end)
  const formatYearDisplay = (startMonth, startYear, endMonth, endYear, isCurrent) => {
    const start = `${startMonth || ""} ${startYear || ""}`.trim();
    const end = isCurrent ? "Present" : `${endMonth || ""} ${endYear || ""}`.trim();
    return `${start} - ${end}`;
  };

  // CREATE - Add new education
  const handleCreate = async () => {
    if (!form.degree.trim()) {
      showMessage("⚠️ Please enter the degree.", "warning");
      return false;
    }

    if (!form.college.trim()) {
      showMessage("⚠️ Please enter the college/institution.", "warning");
      return false;
    }

    if (!form.startMonth || !form.startYear) {
      showMessage("⚠️ Please select the start month and year.", "warning");
      return false;
    }

    if (!form.isCurrent && (!form.endMonth || !form.endYear)) {
      showMessage("⚠️ Please select the end month and year.", "warning");
      return false;
    }

    if (!form.marks.trim()) {
      showMessage("⚠️ Please enter the marks/score.", "warning");
      return false;
    }

    // Validate date range
    const startDate = new Date(form.startYear, months.indexOf(form.startMonth));
    const endDate = form.isCurrent ? new Date() : new Date(form.endYear, months.indexOf(form.endMonth));
    
    if (!form.isCurrent && startDate > endDate) {
      showMessage("⚠️ Start date cannot be after end date.", "warning");
      return false;
    }

    // Format year for display
    const yearDisplay = formatYearDisplay(
      form.startMonth, form.startYear,
      form.endMonth, form.endYear,
      form.isCurrent
    );

    setSaving(true);
    setMessage("");

    try {
      const response = await API.post("/admin/education", {
        degree: form.degree,
        college: form.college,
        year: yearDisplay,
        marks: form.marks,
        startMonth: form.startMonth,
        startYear: form.startYear,
        endMonth: form.endMonth,
        endYear: form.endYear,
        isCurrent: form.isCurrent,
      });
      
      if (response.data.success) {
        showMessage("✅ Education added successfully!", "success");
        setForm(emptyEducation);
        await loadEducation();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Create error:", error);
      const errorMsg = error.response?.data?.message || "❌ Failed to create education.";
      showMessage(errorMsg, "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // UPDATE - Edit existing education
  const handleUpdate = async () => {
    if (!form.degree.trim()) {
      showMessage("⚠️ Please enter the degree.", "warning");
      return false;
    }

    if (!form.college.trim()) {
      showMessage("⚠️ Please enter the college/institution.", "warning");
      return false;
    }

    if (!form.startMonth || !form.startYear) {
      showMessage("⚠️ Please select the start month and year.", "warning");
      return false;
    }

    if (!form.isCurrent && (!form.endMonth || !form.endYear)) {
      showMessage("⚠️ Please select the end month and year.", "warning");
      return false;
    }

    if (!form.marks.trim()) {
      showMessage("⚠️ Please enter the marks/score.", "warning");
      return false;
    }

    const startDate = new Date(form.startYear, months.indexOf(form.startMonth));
    const endDate = form.isCurrent ? new Date() : new Date(form.endYear, months.indexOf(form.endMonth));
    
    if (!form.isCurrent && startDate > endDate) {
      showMessage("⚠️ Start date cannot be after end date.", "warning");
      return false;
    }

    const yearDisplay = formatYearDisplay(
      form.startMonth, form.startYear,
      form.endMonth, form.endYear,
      form.isCurrent
    );

    setSaving(true);
    setMessage("");

    try {
      const response = await API.put(`/admin/education/${editingId}`, {
        degree: form.degree,
        college: form.college,
        year: yearDisplay,
        marks: form.marks,
        startMonth: form.startMonth,
        startYear: form.startYear,
        endMonth: form.endMonth,
        endYear: form.endYear,
        isCurrent: form.isCurrent,
      });
      
      if (response.data.success) {
        showMessage("✅ Education updated successfully!", "success");
        setForm(emptyEducation);
        setEditingId(null);
        await loadEducation();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Update error:", error);
      const errorMsg = error.response?.data?.message || "❌ Failed to update education.";
      showMessage(errorMsg, "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // DELETE - Remove education
  const handleDelete = async (id) => {
    if (!id) return false;
    
    const confirmed = window.confirm(
      "Are you sure you want to delete this education entry?\nThis action cannot be undone."
    );
    if (!confirmed) return false;

    setDeletingId(id);
    setMessage("");

    try {
      const response = await API.delete(`/admin/education/${id}`);
      
      if (response.data.success) {
        showMessage("✅ Education deleted successfully.", "success");
        await loadEducation();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Delete error:", error);
      showMessage(
        error.response?.data?.message || "❌ Failed to delete education.",
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
      showMessage("⚠️ Please select education entries to delete.", "warning");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} education entr${selectedIds.length !== 1 ? 'ies' : 'y'}?\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      for (const id of selectedIds) {
        await API.delete(`/admin/education/${id}`);
      }
      showMessage(`✅ ${selectedIds.length} education entr${selectedIds.length !== 1 ? 'ies' : 'y'} deleted successfully.`, "success");
      await loadEducation();
      setSelectedIds([]);
    } catch (error) {
      console.error("Bulk delete error:", error);
      showMessage("❌ Failed to delete some education entries.", "error");
    } finally {
      setLoading(false);
    }
  };

  // DUPLICATE
  const handleDuplicate = async (item) => {
    if (!item) return;

    try {
      const duplicateData = {
        degree: `${item.degree} (Copy)`,
        college: item.college || "Unknown",
        year: item.year || "",
        marks: item.marks || "",
        startMonth: item.startMonth || "",
        startYear: item.startYear || "",
        endMonth: item.endMonth || "",
        endYear: item.endYear || "",
        isCurrent: item.isCurrent || false,
      };

      const response = await API.post("/admin/education", duplicateData);
      
      if (response.data.success) {
        showMessage("✅ Education duplicated successfully!", "success");
        await loadEducation();
      }
    } catch (error) {
      console.error("Duplicate error:", error);
      showMessage("❌ Failed to duplicate education.", "error");
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
  const editEducation = (item) => {
    if (!item) return;
    
    // Try to parse year string into month/year components
    let startMonth = item.startMonth || "";
    let startYear = item.startYear || "";
    let endMonth = item.endMonth || "";
    let endYear = item.endYear || "";
    let isCurrent = item.isCurrent || false;

    // If no parsed data, try to extract from year string
    if (!startMonth && !startYear && item.year) {
      const parts = item.year.split(" - ");
      if (parts.length === 2) {
        // Try to parse "Month Year - Month Year" format
        const startParts = parts[0].trim().split(" ");
        const endParts = parts[1].trim().split(" ");
        
        if (startParts.length >= 2) {
          startMonth = startParts.slice(0, -1).join(" ");
          startYear = startParts[startParts.length - 1];
        }
        
        if (endParts.length >= 2 && endParts[0] !== "Present") {
          endMonth = endParts.slice(0, -1).join(" ");
          endYear = endParts[endParts.length - 1];
        } else if (endParts[0] === "Present") {
          isCurrent = true;
        }
      }
    }

    setEditingId(item.id);
    setForm({
      degree: item.degree || "",
      college: item.college || item.institution || "",
      startMonth: startMonth,
      startYear: startYear,
      endMonth: endMonth,
      endYear: endYear,
      isCurrent: isCurrent,
      marks: item.marks || item.score || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyEducation);
  };

  // SEARCH, SORT, PAGINATION
  const getFilteredEducation = () => {
    let filtered = [...education];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.degree?.toLowerCase().includes(term) ||
        item.college?.toLowerCase().includes(term) ||
        item.year?.toLowerCase().includes(term) ||
        item.marks?.toLowerCase().includes(term)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = (a[sortBy] || "").toString().toLowerCase();
      let bVal = (b[sortBy] || "").toString().toLowerCase();
      
      if (sortBy === "year") {
        const getStartYear = (yearStr) => {
          const match = yearStr?.match(/\d{4}/);
          return match ? parseInt(match[0]) : 0;
        };
        aVal = getStartYear(a.year);
        bVal = getStartYear(b.year);
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      
      if (sortOrder === "asc") {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });

    return filtered;
  };

  const filteredEdu = getFilteredEducation();
  const totalPages = Math.ceil(filteredEdu.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEdu = filteredEdu.slice(startIndex, startIndex + itemsPerPage);

  // SELECT ALL
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(currentEdu.map(item => item.id));
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
      const dataStr = JSON.stringify(education, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `education_${new Date().toISOString().slice(0,10)}.json`;
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
            `This will add ${importedData.length} education entr${importedData.length !== 1 ? 'ies' : 'y'}. Continue?`
          );
          if (!confirmed) return;

          setLoading(true);
          for (const edu of importedData) {
            await API.post("/admin/education", {
              degree: edu.degree || "Untitled Degree",
              college: edu.college || edu.institution || "Unknown Institution",
              year: edu.year || "",
              marks: edu.marks || edu.score || "",
              startMonth: edu.startMonth || "",
              startYear: edu.startYear || "",
              endMonth: edu.endMonth || "",
              endYear: edu.endYear || "",
              isCurrent: edu.isCurrent || false,
            });
          }
          showMessage(`✅ ${importedData.length} education entr${importedData.length !== 1 ? 'ies' : 'y'} imported successfully!`, "success");
          await loadEducation();
        } catch (parseError) {
          console.error("Parse error:", parseError);
          showMessage("❌ Failed to parse imported file.", "error");
        } finally {
          setLoading(false);
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

  const hasEducation = Array.isArray(education) && education.length > 0;

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
              ADMIN / EDUCATION
            </p>
            <h1 className="mt-2 text-3xl font-bold">Manage Education</h1>
            <p 
              className="mt-1 text-sm"
              style={{ color: themeColors?.textSecondary || '#94a3b8' }}
            >
              {hasEducation ? `${education.length} education entr${education.length !== 1 ? 'ies' : 'y'} in your portfolio` : 'No education in your portfolio'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {hasEducation && (
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
              className="rounded-xl border px-4 py-2 text-sm transition hover:bg-white/10 cursor-pointer"
              style={{
                borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
                color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)',
              }}
            >
              📥 Import
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
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
            {editingId ? "✏️ Edit Education" : "➕ Add New Education"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            {/* Degree */}
            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Degree <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="degree"
                value={form.degree}
                onChange={handleChange}
                placeholder="Enter degree name"
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

            {/* College/Institution */}
            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                College/Institution <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="college"
                value={form.college}
                onChange={handleChange}
                placeholder="Enter college or institution name or school name"
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

            {/* Start Month & Year */}
            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Start Date <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="startMonth"
                  value={form.startMonth}
                  onChange={handleChange}
                  className="flex-1 rounded-xl border px-3 py-3 outline-none transition focus:ring-2"
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
                >
                  <option value="">Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select
                  name="startYear"
                  value={form.startYear}
                  onChange={handleChange}
                  className="flex-1 rounded-xl border px-3 py-3 outline-none transition focus:ring-2"
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
                >
                  <option value="">Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* End Month & Year */}
            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                End Date <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="endMonth"
                  value={form.endMonth}
                  onChange={handleChange}
                  disabled={form.isCurrent}
                  className="flex-1 rounded-xl border px-3 py-3 outline-none transition focus:ring-2 disabled:opacity-50"
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
                >
                  <option value="">Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select
                  name="endYear"
                  value={form.endYear}
                  onChange={handleChange}
                  disabled={form.isCurrent}
                  className="flex-1 rounded-xl border px-3 py-3 outline-none transition focus:ring-2 disabled:opacity-50"
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
                >
                  <option value="">Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <label className="mt-2 flex items-center gap-2 text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                <input
                  type="checkbox"
                  name="isCurrent"
                  checked={form.isCurrent}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                />
                Currently studying here (Present)
              </label>
            </div>

            {/* Marks/Score */}
            <div>
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Marks/Score <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="marks"
                value={form.marks}
                onChange={handleChange}
                placeholder="Enter Your CGPA or Percentage or Score"
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

            {/* Buttons */}
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
                  editingId ? "Update Education" : "Add Education"
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
              Education entries are displayed on the portfolio's Education section in chronological order.
            </p>
          </div>
        </div>

        {/* LIST SECTION - Same as before */}
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
              <h2 className="text-xl font-semibold">Your Education</h2>
              {hasEducation && (
                <label className="flex items-center gap-2 text-sm text-gray-500">
                  <input
                    type="checkbox"
                    checked={currentEdu.length > 0 && currentEdu.every(item => selectedIds.includes(item.id))}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                    aria-label="Select all education entries on this page"
                  />
                  Select all
                </label>
              )}
              {!loading && hasEducation && (
                <span 
                  className="rounded-full px-3 py-1 text-xs"
                  style={{
                    backgroundColor: `${getThemeColor()}20`,
                    color: getThemeColor(),
                  }}
                >
                  {filteredEdu.length} total
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search education..."
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
                <option value="degree">Sort by Degree</option>
                <option value="college">Sort by College</option>
                <option value="year">Sort by Year</option>
                <option value="marks">Sort by Marks</option>
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
                <p className="text-white/50">Loading education...</p>
              </div>
            </div>
          ) : !hasEducation ? (
            <div 
              className="rounded-xl border p-12 text-center"
              style={{
                borderColor: '#d1d5db',
                backgroundColor: '#ffffff',
              }}
            >
              <div className="text-6xl mb-4">🎓</div>
              <p className="text-gray-500">No education entries found. Add your first education above!</p>
            </div>
          ) : filteredEdu.length === 0 ? (
            <div 
              className="rounded-xl border p-12 text-center"
              style={{
                borderColor: '#d1d5db',
                backgroundColor: '#ffffff',
              }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500">No education entries match your search.</p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-sm text-cyan-600 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {currentEdu.map((item) => {
                  if (!item) return null;
                  
                  const isSelected = selectedIds.includes(item.id);
                  
                  return (
                    <div
                      key={item.id || item.degree + item.year}
                      className={`flex flex-col gap-4 rounded-xl border p-5 transition shadow-sm hover:shadow-md md:flex-row md:items-center md:justify-between ${
                        isSelected ? 'ring-2 ring-cyan-400' : ''
                      }`}
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: isSelected ? '#08bde0' : '#e5e7eb',
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelect(item.id)}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div 
                              className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                              style={{
                                backgroundColor: `${getThemeColor()}15`,
                                color: getThemeColor(),
                              }}
                            >
                              🎓
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {item.degree || "Untitled Degree"}
                              </h3>
                              <p className="mt-1 text-sm" style={{ color: getThemeColor() }}>
                                {item.college || "Unknown Institution"}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            <span>📅 {item.year || "Year not specified"}</span>
                            {item.marks && (
                              <>
                                <span className="text-gray-300">|</span>
                                <span>🎯 {item.marks}</span>
                              </>
                            )}
                            {item.isCurrent && (
                              <>
                                <span className="text-gray-300">|</span>
                                <span className="text-green-600">● Current</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
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
                          onClick={() => editEducation(item)}
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

              <div className="mt-4 flex flex-wrap justify-between items-center gap-2 text-xs" style={{ color: themeColors?.textSecondary || '#94a3b8' }}>
                <span>
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEdu.length)} of {filteredEdu.length} education entries
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