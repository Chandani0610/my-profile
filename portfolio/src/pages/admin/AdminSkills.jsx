import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useTheme } from "../../context/ThemeContext";

// Define all skill categories with their icons and labels
const skillCategories = [
  { key: "languages", label: "Languages", icon: "💻" },
  { key: "frontend", label: "Frontend", icon: "🎨" },
  { key: "backend", label: "Backend", icon: "⚙️" },
  { key: "database", label: "Database", icon: "🗄️" },
  { key: "tools", label: "Tools", icon: "🛠️" },
  { key: "coreSubjects", label: "Core Subjects", icon: "📚" },
];

export default function AdminSkills() {
  const navigate = useNavigate();
  const { themeColors, currentTheme } = useTheme();

  // ===== STATE =====
  const [skills, setSkills] = useState({});
  const [category, setCategory] = useState("frontend");
  const [skillName, setSkillName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSkillOldName, setEditingSkillOldName] = useState(null);
  const [editingSkillNewName, setEditingSkillNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

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

  // ===== MESSAGE HELPER =====
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

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

  // ===== READ - Load Skills =====
  const loadSkills = async () => {
    try {
      setLoading(true);
      const response = await API.get("/portfolio");

      if (response.data.success) {
        const skillsData = response.data.data.skills || {};
        const completeSkills = { ...skillsData };
        skillCategories.forEach(cat => {
          if (!completeSkills[cat.key]) {
            completeSkills[cat.key] = [];
          }
        });
        setSkills(completeSkills);
      } else {
        setSkills({});
      }
    } catch (error) {
      console.error("Failed to load skills:", error);
      showMessage("❌ Failed to load skills.", "error");
      setSkills({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadSkills();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // ===== CREATE - Add New Skill =====
  const handleCreate = async () => {
    const trimmedSkill = skillName.trim();
    if (!trimmedSkill) {
      showMessage("⚠️ Please enter a skill name.", "warning");
      return false;
    }

    const currentSkills = skills[category] || [];
    if (currentSkills.includes(trimmedSkill)) {
      showMessage(`⚠️ "${trimmedSkill}" already exists in ${category}.`, "warning");
      return false;
    }

    setSaving(true);
    setMessage("");

    try {
      const updatedSkills = [...currentSkills, trimmedSkill];

      // ✅ UPDATED: Using the new bulk update endpoint
      await API.put(`/admin/skills/category/${category}`, {
        skills: updatedSkills,
      });

      setSkills({ ...skills, [category]: updatedSkills });
      setSkillName("");
      showMessage(`✅ Skill added to ${category} successfully!`, "success");
      return true;
    } catch (error) {
      console.error("Create error:", error);
      showMessage(error.response?.data?.message || "❌ Failed to add skill.", "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ===== UPDATE - Edit Skill Name =====
  const handleUpdate = async () => {
    if (!editingSkillOldName || !editingSkillNewName.trim()) {
      showMessage("⚠️ Please enter a valid skill name.", "warning");
      return false;
    }

    if (editingSkillOldName === editingSkillNewName.trim()) {
      showMessage("⚠️ No changes made.", "warning");
      return false;
    }

    const currentSkills = skills[editingCategory] || [];
    if (currentSkills.includes(editingSkillNewName.trim())) {
      showMessage(`⚠️ "${editingSkillNewName.trim()}" already exists in ${editingCategory}.`, "warning");
      return false;
    }

    setSaving(true);
    setMessage("");

    try {
      const updatedSkills = currentSkills.map(skill => 
        skill === editingSkillOldName ? editingSkillNewName.trim() : skill
      );

      // ✅ UPDATED: Using the new bulk update endpoint
      await API.put(`/admin/skills/category/${editingCategory}`, {
        skills: updatedSkills,
      });

      setSkills({ ...skills, [editingCategory]: updatedSkills });
      setEditingCategory(null);
      setEditingSkillOldName(null);
      setEditingSkillNewName("");
      showMessage(`✅ Skill updated successfully!`, "success");
      return true;
    } catch (error) {
      console.error("Update error:", error);
      showMessage(error.response?.data?.message || "❌ Failed to update skill.", "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ===== DELETE - Remove Single Skill =====
  const handleDelete = async (category, skillToDelete) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${skillToDelete}" from ${category}?\nThis action cannot be undone.`
    );
    if (!confirmed) return false;

    setDeleting(skillToDelete);
    setMessage("");

    try {
      const currentSkills = skills[category] || [];
      const updatedSkills = currentSkills.filter(skill => skill !== skillToDelete);

      // ✅ UPDATED: Using the new bulk update endpoint
      await API.put(`/admin/skills/category/${category}`, {
        skills: updatedSkills,
      });

      setSkills({ ...skills, [category]: updatedSkills });
      showMessage(`✅ Skill removed successfully.`, "success");
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      showMessage(error.response?.data?.message || "❌ Failed to remove skill.", "error");
      return false;
    } finally {
      setDeleting(null);
    }
  };

  // ===== BULK DELETE =====
  const handleBulkDelete = async (category, skillsToDelete) => {
    if (!skillsToDelete || skillsToDelete.length === 0) {
      showMessage("⚠️ No skills selected to delete.", "warning");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${skillsToDelete.length} skill(s) from ${category}?\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const currentSkills = skills[category] || [];
      const updatedSkills = currentSkills.filter(skill => !skillsToDelete.includes(skill));

      // ✅ UPDATED: Using the new bulk update endpoint
      await API.put(`/admin/skills/category/${category}`, {
        skills: updatedSkills,
      });

      setSkills({ ...skills, [category]: updatedSkills });
      setSelectedSkills([]);
      showMessage(`✅ ${skillsToDelete.length} skill(s) removed successfully.`, "success");
    } catch (error) {
      console.error("Bulk delete error:", error);
      showMessage(error.response?.data?.message || "❌ Failed to remove skills.", "error");
    }
  };

  // ===== DUPLICATE Skill =====
  const handleDuplicate = async (skill, fromCategory, toCategory) => {
    if (fromCategory === toCategory) {
      showMessage("⚠️ Select a different category to duplicate.", "warning");
      return;
    }

    const targetSkills = skills[toCategory] || [];
    if (targetSkills.includes(skill)) {
      showMessage(`⚠️ "${skill}" already exists in ${toCategory}.`, "warning");
      return;
    }

    try {
      const updatedTargetSkills = [...targetSkills, skill];
      
      // ✅ UPDATED: Using the new bulk update endpoint
      await API.put(`/admin/skills/category/${toCategory}`, {
        skills: updatedTargetSkills,
      });

      setSkills({ ...skills, [toCategory]: updatedTargetSkills });
      showMessage(`✅ "${skill}" duplicated to ${toCategory} successfully!`, "success");
    } catch (error) {
      console.error("Duplicate error:", error);
      showMessage(error.response?.data?.message || "❌ Failed to duplicate skill.", "error");
    }
  };

  // ===== SELECT SKILLS =====
  const toggleSkillSelection = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const clearSelectedSkills = () => {
    setSelectedSkills([]);
  };

  // ===== FORM SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleCreate();
  };

  // ===== EDIT =====
  const startEdit = (category, skillName) => {
    setEditingCategory(category);
    setEditingSkillOldName(skillName);
    setEditingSkillNewName(skillName);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditingSkillOldName(null);
    setEditingSkillNewName("");
  };

  // ===== SEARCH FILTER =====
  const getFilteredSkills = () => {
    if (!searchTerm) return skills;

    const filtered = {};
    Object.entries(skills).forEach(([category, skillList]) => {
      const filteredList = skillList.filter(skill =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredList.length > 0) {
        filtered[category] = filteredList;
      }
    });
    return filtered;
  };

  const filteredSkills = getFilteredSkills();
  const totalSkills = Object.values(skills).reduce(
    (total, skillsArray) => total + (Array.isArray(skillsArray) ? skillsArray.length : 0),
    0
  );
  const activeCategories = Object.keys(skills).filter(key => skills[key]?.length > 0).length;

  // ===== EXPORT DATA =====
  const exportData = () => {
    try {
      const dataStr = JSON.stringify(skills, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `skills_${new Date().toISOString().slice(0, 10)}.json`;
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

  // ===== IMPORT DATA =====
  const importData = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          if (typeof importedData !== 'object') {
            showMessage("⚠️ Invalid data format. Expected object.", "warning");
            return;
          }

          const confirmed = window.confirm(
            `This will replace all existing skills with ${Object.keys(importedData).length} categories. Continue?`
          );
          if (!confirmed) return;

          setLoading(true);
          for (const [category, skillList] of Object.entries(importedData)) {
            if (Array.isArray(skillList)) {
              // ✅ UPDATED: Using the new bulk update endpoint
              await API.put(`/admin/skills/category/${category}`, {
                skills: skillList,
              });
            }
          }
          showMessage(`✅ Skills imported successfully!`, "success");
          await loadSkills();
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

  // ===== RENDER =====
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
        {/* ===== HEADER ===== */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p 
              className="text-sm font-medium"
              style={{ color: getThemeColor() }}
            >
              ADMIN / SKILLS
            </p>
            <h1 className="mt-2 text-3xl font-bold">Manage Skills</h1>
            <p 
              className="mt-1 text-sm"
              style={{ color: themeColors?.textSecondary || '#94a3b8' }}
            >
              {totalSkills} skills across {activeCategories} categories
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {selectedSkills.length > 0 && (
              <button
                onClick={() => {
                  const currentCategory = document.querySelector('[data-category]')?.dataset.category;
                  if (currentCategory) {
                    handleBulkDelete(currentCategory, selectedSkills);
                  }
                }}
                className="rounded-xl px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                style={{
                  backgroundColor: '#fee2e2',
                }}
              >
                🗑 Delete Selected ({selectedSkills.length})
              </button>
            )}
            {totalSkills > 0 && (
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

        {/* ===== MESSAGE DISPLAY ===== */}
        {message && (
          <div 
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${getMessageStyles()}`}
          >
            {message}
          </div>
        )}

        {/* ===== CREATE/EDIT FORM ===== */}
        <div 
          className="mb-10 rounded-2xl border p-6"
          style={{
            borderColor: themeColors?.border || 'rgba(255,255,255,0.1)',
            backgroundColor: themeColors?.cardBg || 'rgba(255,255,255,0.05)',
          }}
        >
          <h2 className="mb-6 text-xl font-semibold">
            {editingSkillOldName ? "✏️ Edit Skill" : "➕ Add New Skill"}
          </h2>

          <form onSubmit={editingSkillOldName ? (e) => { e.preventDefault(); handleUpdate(); } : handleSubmit} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Skill Name <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                value={editingSkillOldName ? editingSkillNewName : skillName}
                onChange={(e) => {
                  if (editingSkillOldName) {
                    setEditingSkillNewName(e.target.value);
                  } else {
                    setSkillName(e.target.value);
                  }
                }}
                placeholder={editingSkillOldName ? "Edit skill name..." : "Enter new skill name..."}
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

            <div className="flex-1 min-w-[200px]">
              <label className="mb-2 block text-sm" style={{ color: themeColors?.textSecondary || 'rgba(255,255,255,0.7)' }}>
                Category <span className="text-red-400 ml-1">*</span>
              </label>
              <select
                value={editingSkillOldName ? editingCategory : category}
                onChange={(e) => {
                  if (editingSkillOldName) {
                    setEditingCategory(e.target.value);
                  } else {
                    setCategory(e.target.value);
                  }
                }}
                disabled={!!editingSkillOldName}
                className="w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2"
                style={{
                  borderColor: '#d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                }}
              >
                {skillCategories.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-3">
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
                    {editingSkillOldName ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingSkillOldName ? "Update Skill" : "Add Skill"
                )}
              </button>

              {editingSkillOldName && (
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
              Skills are displayed on the portfolio's Skills section.
            </p>
          </div>
        </div>

        {/* ===== SKILLS LIST ===== */}
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
              <h2 className="text-xl font-semibold">Your Skills</h2>
              {!loading && totalSkills > 0 && (
                <span 
                  className="rounded-full px-3 py-1 text-xs"
                  style={{
                    backgroundColor: `${getThemeColor()}20`,
                    color: getThemeColor(),
                  }}
                >
                  {totalSkills} total
                </span>
              )}
              {selectedSkills.length > 0 && (
                <span 
                  className="rounded-full px-3 py-1 text-xs bg-blue-500/20 text-blue-400"
                >
                  {selectedSkills.length} selected
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search skills..."
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
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-sm text-gray-400 hover:text-gray-600"
                >
                  ✕ Clear
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
                <p className="text-white/50">Loading skills...</p>
              </div>
            </div>
          ) : totalSkills === 0 ? (
            <div 
              className="rounded-xl border p-12 text-center"
              style={{
                borderColor: '#d1d5db',
                backgroundColor: '#ffffff',
              }}
            >
              <div className="text-6xl mb-4">🛠️</div>
              <p className="text-gray-500">No skills found. Add your first skill above!</p>
            </div>
          ) : Object.keys(filteredSkills).length === 0 ? (
            <div 
              className="rounded-xl border p-12 text-center"
              style={{
                borderColor: '#d1d5db',
                backgroundColor: '#ffffff',
              }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500">No skills match your search.</p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-sm text-cyan-600 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {skillCategories.map((cat) => {
                const skillList = filteredSkills[cat.key] || [];
                if (skillList.length === 0) return null;

                return (
                  <div
                    key={cat.key}
                    data-category={cat.key}
                    className="rounded-xl border p-5 transition shadow-sm hover:shadow-md"
                    style={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                    }}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{cat.icon}</span>
                        <h3 className="text-lg font-semibold capitalize" style={{ color: getThemeColor() }}>
                          {cat.label}
                        </h3>
                      </div>
                      <span className="text-xs text-gray-400">
                        {skillList.length} skill{skillList.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillList.map((skill) => (
                        <span
                          key={skill}
                          className={`group flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition hover:border-gray-300 ${
                            selectedSkills.includes(skill) ? 'ring-2 ring-cyan-400' : ''
                          }`}
                          style={{
                            borderColor: '#e5e7eb',
                            backgroundColor: selectedSkills.includes(skill) ? '#e0f7fa' : '#f9fafb',
                            color: '#1f2937',
                          }}
                        >
                          {/* Checkbox for bulk operations */}
                          <input
                            type="checkbox"
                            checked={selectedSkills.includes(skill)}
                            onChange={() => toggleSkillSelection(skill)}
                            className="mr-1 h-3 w-3 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                          />
                          <span>{skill}</span>
                          <div className="flex items-center gap-0.5 ml-1">
                            {/* Duplicate Button */}
                            <div className="relative group/dup">
                              <button
                                onClick={() => {
                                  const toCategory = prompt(`Select category to duplicate "${skill}" to:\n\nAvailable categories:\n${skillCategories.map(c => c.key).join(', ')}`);
                                  if (toCategory && skillCategories.find(c => c.key === toCategory)) {
                                    handleDuplicate(skill, cat.key, toCategory);
                                  } else if (toCategory) {
                                    showMessage(`⚠️ Invalid category. Choose from: ${skillCategories.map(c => c.key).join(', ')}`, "warning");
                                  }
                                }}
                                className="text-gray-400 transition hover:text-purple-500 opacity-0 group-hover:opacity-100"
                                title="Duplicate to another category"
                              >
                                📋
                              </button>
                            </div>
                            {/* Edit Button */}
                            <button
                              onClick={() => startEdit(cat.key, skill)}
                              className="text-gray-400 transition hover:text-blue-500 opacity-0 group-hover:opacity-100"
                              title="Edit skill"
                            >
                              ✏️
                            </button>
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(cat.key, skill)}
                              disabled={deleting === skill}
                              className="text-gray-400 transition hover:text-red-500 disabled:opacity-50 opacity-0 group-hover:opacity-100"
                              title="Delete skill"
                            >
                              {deleting === skill ? (
                                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                              ) : (
                                "×"
                              )}
                            </button>
                          </div>
                        </span>
                      ))}
                    </div>
                    {/* Bulk actions for this category */}
                    {selectedSkills.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                        <button
                          onClick={() => {
                            const categorySkills = skills[cat.key] || [];
                            const selectedInCategory = selectedSkills.filter(s => categorySkills.includes(s));
                            if (selectedInCategory.length > 0) {
                              handleBulkDelete(cat.key, selectedInCategory);
                            }
                          }}
                          className="text-xs text-red-500 hover:text-red-700 transition"
                        >
                          Delete Selected ({selectedSkills.filter(s => (skills[cat.key] || []).includes(s)).length})
                        </button>
                        <button
                          onClick={clearSelectedSkills}
                          className="text-xs text-gray-400 hover:text-gray-600 transition"
                        >
                          Clear Selection
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}