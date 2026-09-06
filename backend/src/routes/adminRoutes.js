const express = require("express");

const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,

  createProject,
  updateProject,
  deleteProject,

  createEducation,
  updateEducation,
  deleteEducation,

  createSkill,
  updateSkill,
  deleteSkill,
  updateSkillsByCategory,

  createCertification,
  updateCertification,
  deleteCertification,

  createLanguage,
  deleteLanguage,

  createHobby,
  deleteHobby,

  updatePersonalInfo,

  upload,
  uploadImage
} = require("../controllers/adminController");


// =====================================================
// AUTH
// =====================================================

// Register
router.post("/register", registerAdmin);

// Login
router.post("/login", loginAdmin);

// Logout
router.post("/logout", logoutAdmin);

// Current logged-in admin
router.get("/me", getCurrentAdmin);


// =====================================================
// PROJECTS
// =====================================================

// Create
router.post("/projects", createProject);

// Update
router.put("/projects/:id", updateProject);

// Delete
router.delete("/projects/:id", deleteProject);


// =====================================================
// EDUCATION
// =====================================================

// Create
router.post("/education", createEducation);

// Update
router.put("/education/:id", updateEducation);

// Delete
router.delete("/education/:id", deleteEducation);


// =====================================================
// SKILLS
// =====================================================

// Create individual skill
router.post("/skills", createSkill);

// Update individual skill
router.put("/skills/:id", updateSkill);

// Delete individual skill
router.delete("/skills/:id", deleteSkill);

// Bulk update skills by category
router.put(
  "/skills/category/:category",
  updateSkillsByCategory
);


// =====================================================
// CERTIFICATIONS
// =====================================================

// Create certification
router.post(
  "/certifications",
  createCertification
);

// Update certification
router.put(
  "/certifications/:id",
  updateCertification
);

// Delete certification
router.delete(
  "/certifications/:id",
  deleteCertification
);


// =====================================================
// LANGUAGES
// =====================================================

// Create language
router.post(
  "/languages",
  createLanguage
);

// Delete language
router.delete(
  "/languages/:id",
  deleteLanguage
);


// =====================================================
// HOBBIES
// =====================================================

// Create hobby
router.post(
  "/hobbies",
  createHobby
);

// Delete hobby
router.delete(
  "/hobbies/:id",
  deleteHobby
);


// =====================================================
// PERSONAL INFORMATION
// =====================================================

// Create / Update personal information
router.put(
  "/personal",
  updatePersonalInfo
);


// =====================================================
// IMAGE UPLOAD
// =====================================================

// Upload certification image
router.post(
  "/upload",
  upload.single("image"),
  uploadImage
);


// =====================================================
// IMPORTANT
// =====================================================

module.exports = router;