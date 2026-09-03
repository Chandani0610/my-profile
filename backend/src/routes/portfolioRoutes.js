const express = require("express");

const {
  getPortfolio,
  getPersonalInfo,
  getEducation,
  getSkills,
  getProjects,
  getHobbies,
  getLanguages,
  getCertifications
} = require("../controllers/portfolioController");

const router = express.Router();

// Get complete portfolio
router.get("/", getPortfolio);

// Get personal information
router.get("/personal", getPersonalInfo);

// Get education
router.get("/education", getEducation);

// Get skills
router.get("/skills", getSkills);

// Get projects
router.get("/projects", getProjects);

// Get hobbies
router.get("/hobbies", getHobbies);

// Get languages
router.get("/languages", getLanguages);

// Get certifications
router.get("/certifications", getCertifications);

module.exports = router;