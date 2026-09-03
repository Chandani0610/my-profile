const express = require("express");

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

  createCertification,
  deleteCertification,

  createLanguage,
  deleteLanguage,

  createHobby,
  deleteHobby,

  updatePersonalInfo
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =========================================
// AUTH
// =========================================

router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

router.post("/logout", logoutAdmin);

router.get(
  "/me",
  authMiddleware,
  getCurrentAdmin
);


// =========================================
// PERSONAL INFORMATION
// =========================================

router.put(
  "/personal",
  authMiddleware,
  updatePersonalInfo
);


// =========================================
// PROJECTS
// =========================================

router.post(
  "/projects",
  authMiddleware,
  createProject
);

router.put(
  "/projects/:id",
  authMiddleware,
  updateProject
);

router.delete(
  "/projects/:id",
  authMiddleware,
  deleteProject
);


// =========================================
// EDUCATION
// =========================================

router.post(
  "/education",
  authMiddleware,
  createEducation
);

router.put(
  "/education/:id",
  authMiddleware,
  updateEducation
);

router.delete(
  "/education/:id",
  authMiddleware,
  deleteEducation
);


// =========================================
// SKILLS
// =========================================

router.post(
  "/skills",
  authMiddleware,
  createSkill
);

router.put(
  "/skills/:id",
  authMiddleware,
  updateSkill
);

router.delete(
  "/skills/:id",
  authMiddleware,
  deleteSkill
);


// =========================================
// CERTIFICATIONS
// =========================================

router.post(
  "/certifications",
  authMiddleware,
  createCertification
);

router.delete(
  "/certifications/:id",
  authMiddleware,
  deleteCertification
);


// =========================================
// LANGUAGES
// =========================================

router.post(
  "/languages",
  authMiddleware,
  createLanguage
);

router.delete(
  "/languages/:id",
  authMiddleware,
  deleteLanguage
);


// =========================================
// HOBBIES
// =========================================

router.post(
  "/hobbies",
  authMiddleware,
  createHobby
);

router.delete(
  "/hobbies/:id",
  authMiddleware,
  deleteHobby
);


module.exports = router;