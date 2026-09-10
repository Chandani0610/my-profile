const express = require("express");

const router = express.Router();

const {
  // =====================================================
  // AUTH
  // =====================================================
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  getDashboardStats,

  // =====================================================
  // PROJECTS
  // =====================================================
  createProject,
  updateProject,
  deleteProject,

  // =====================================================
  // EDUCATION
  // =====================================================
  createEducation,
  updateEducation,
  deleteEducation,

  // =====================================================
  // SKILLS
  // =====================================================
  createSkill,
  updateSkill,
  deleteSkill,
  updateSkillsByCategory,

  // =====================================================
  // CERTIFICATIONS
  // =====================================================
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,

  // =====================================================
  // LANGUAGES
  // =====================================================
  getLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,

  // =====================================================
  // HOBBIES
  // =====================================================
  getHobbies,
  createHobby,
  updateHobby,
  deleteHobby,

  // =====================================================
  // PERSONAL INFORMATION
  // =====================================================
  getPersonalInfo,
  updatePersonalInfo,

  // =====================================================
  // IMAGE / PDF UPLOAD
  // =====================================================
  upload,
  uploadImage,
} = require("../controllers/adminController");

// =====================================================
// AUTH
// =====================================================

// Register Admin
router.post("/register", registerAdmin);

// Login Admin
router.post("/login", loginAdmin);

// Logout Admin
router.post("/logout", logoutAdmin);

// Get Current Logged-in Admin
router.get("/me", getCurrentAdmin);

// Dashboard Statistics (Fast COUNT)
router.get("/stats", getDashboardStats);
router.get("/dashboard/stats", getDashboardStats);

// =====================================================
// PROJECTS
// =====================================================

// Create Project
router.post("/projects", createProject);

// Update Project
router.put("/projects/:id", updateProject);

// Delete Project
router.delete("/projects/:id", deleteProject);

// =====================================================
// EDUCATION
// =====================================================

// Create Education
router.post("/education", createEducation);

// Update Education
router.put("/education/:id", updateEducation);

// Delete Education
router.delete("/education/:id", deleteEducation);

// =====================================================
// SKILLS
// =====================================================

// Create Individual Skill
router.post("/skills", createSkill);

// Update Individual Skill
router.put("/skills/:id", updateSkill);

// Delete Individual Skill
router.delete("/skills/:id", deleteSkill);

// Bulk Update Skills by Category
router.put(
  "/skills/category/:category",
  updateSkillsByCategory
);

// =====================================================
// CERTIFICATIONS
// =====================================================

// Get All Certifications
router.get(
  "/certifications",
  getCertifications
);

// Create Certification
router.post(
  "/certifications",
  createCertification
);

// Update Certification
router.put(
  "/certifications/:id",
  updateCertification
);

// Delete Certification
router.delete(
  "/certifications/:id",
  deleteCertification
);

// =====================================================
// LANGUAGES
// =====================================================

// Get All Languages
router.get(
  "/languages",
  getLanguages
);

// Create Language
router.post(
  "/languages",
  createLanguage
);

// Update Language
router.put(
  "/languages/:id",
  updateLanguage
);

// Delete Language
router.delete(
  "/languages/:id",
  deleteLanguage
);

// =====================================================
// HOBBIES
// =====================================================

// Get All Hobbies
router.get(
  "/hobbies",
  getHobbies
);

// Create Hobby
router.post(
  "/hobbies",
  createHobby
);

// Update Hobby
router.put(
  "/hobbies/:id",
  updateHobby
);

// Delete Hobby
router.delete(
  "/hobbies/:id",
  deleteHobby
);

// =====================================================
// PERSONAL INFORMATION
// =====================================================

// Get Personal Information
router.get(
  "/personal",
  getPersonalInfo
);

// Create / Update Personal Information
router.put(
  "/personal",
  updatePersonalInfo
);

// =====================================================
// IMAGE / PDF UPLOAD
// =====================================================

// Upload Certification Image / PDF
router.post(
  "/upload",
  upload.single("image"),
  uploadImage
);

router.post(
  "/upload/image",
  upload.single("image"),
  uploadImage
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;