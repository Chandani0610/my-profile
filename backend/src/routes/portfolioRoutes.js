const express = require("express");

const router = express.Router();

const { pool } = require("../config/database");

// =====================================================
// SKILL CATEGORIES
// =====================================================

const SKILL_CATEGORIES = {
  languages: [],
  frontend: [],
  backend: [],
  database: [],
  tools: [],
  coreSubjects: [],
};

// =====================================================
// FORMAT SKILLS
// =====================================================

const formatSkills = (rows) => {
  const skills = {
    languages: [],
    frontend: [],
    backend: [],
    database: [],
    tools: [],
    coreSubjects: [],
  };

  rows.forEach((skill) => {
    if (skills[skill.category]) {
      skills[skill.category].push(skill.skill_name);
    }
  });

  return skills;
};

// =====================================================
// GET COMPLETE PORTFOLIO
// =====================================================

router.get("/", async (req, res, next) => {
  try {
    // -----------------------------------------------
    // THEME SETTING
    // -----------------------------------------------

    let theme = "purple";
    try {
      const [themeRows] = await pool.query(`
        SELECT setting_value FROM portfolio_settings WHERE setting_key = 'theme' LIMIT 1
      `);
      if (themeRows.length > 0 && themeRows[0].setting_value) {
        theme = themeRows[0].setting_value;
      }
    } catch {
      theme = "purple";
    }

    // -----------------------------------------------
    // PERSONAL INFORMATION
    // -----------------------------------------------

    const [personalRows] = await pool.query(`
      SELECT *, role AS title
      FROM personal_info
      ORDER BY id DESC
      LIMIT 1
    `);

    // -----------------------------------------------
    // PROJECTS
    // -----------------------------------------------

    const [projectRows] = await pool.query(`
      SELECT *
      FROM projects
      ORDER BY id DESC
    `);

    // -----------------------------------------------
    // EDUCATION
    // -----------------------------------------------

    const [educationRows] = await pool.query(`
      SELECT *
      FROM education
      ORDER BY id DESC
    `);

    // -----------------------------------------------
    // SKILLS
    // -----------------------------------------------

    const [skillRows] = await pool.query(`
      SELECT *
      FROM skills
      ORDER BY id ASC
    `);

    // -----------------------------------------------
    // CERTIFICATIONS
    // -----------------------------------------------

    const [certificationRows] = await pool.query(`
      SELECT *,
             name AS certification_name
      FROM certifications
      ORDER BY id DESC
    `);

    // -----------------------------------------------
    // LANGUAGES
    // -----------------------------------------------

    const [languageRows] = await pool.query(`
      SELECT id,
             name,
             name AS language_name,
             flag,
             level,
             level AS proficiency_level
      FROM languages
      ORDER BY id ASC
    `);

    // -----------------------------------------------
    // HOBBIES
    // -----------------------------------------------

    const [hobbyRows] = await pool.query(`
      SELECT id,
             hobby_name,
             hobby_name AS name,
             icon
      FROM hobbies
      ORDER BY id ASC
    `);

    // -----------------------------------------------
    // FORMAT SKILLS
    // -----------------------------------------------

    const skills = formatSkills(skillRows);

    // -----------------------------------------------
    // FINAL RESPONSE
    // -----------------------------------------------

    res.status(200).json({
      success: true,
      data: {
        theme,

        personalInfo:
          personalRows.length > 0
            ? personalRows[0]
            : null,

        personal:
          personalRows.length > 0
            ? personalRows[0]
            : null,

        projects: projectRows,

        education: educationRows,

        skills,

        certifications: certificationRows,

        languages: languageRows,

        hobbies: hobbyRows,
      },
    });
  } catch (error) {
    console.error(
      "❌ Error fetching complete portfolio:",
      error
    );

    next(error);
  }
});

// =====================================================
// GET PROJECTS
// GET /api/portfolio/projects
// =====================================================

router.get("/projects", async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM projects
      ORDER BY id DESC
    `);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "❌ Error fetching projects:",
      error
    );

    next(error);
  }
});

// =====================================================
// GET EDUCATION
// GET /api/portfolio/education
// =====================================================

router.get("/education", async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM education
      ORDER BY id DESC
    `);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "❌ Error fetching education:",
      error
    );

    next(error);
  }
});

// =====================================================
// GET SKILLS
// GET /api/portfolio/skills
// =====================================================

router.get("/skills", async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM skills
      ORDER BY id ASC
    `);

    const skills = formatSkills(rows);

    res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    console.error(
      "❌ Error fetching skills:",
      error
    );

    next(error);
  }
});

// =====================================================
// GET CERTIFICATIONS
// GET /api/portfolio/certifications
// =====================================================

router.get(
  "/certifications",
  async (req, res, next) => {
    try {
      const [rows] = await pool.query(`
        SELECT *
        FROM certifications
        ORDER BY id DESC
      `);

      res.status(200).json({
        success: true,
        data: rows,
      });
    } catch (error) {
      console.error(
        "❌ Error fetching certifications:",
        error
      );

      next(error);
    }
  }
);

// =====================================================
// GET LANGUAGES
// GET /api/portfolio/languages
// =====================================================

router.get(
  "/languages",
  async (req, res, next) => {
    try {
      const [rows] = await pool.query(`
        SELECT id,
               name,
               name AS language_name,
               flag,
               level,
               level AS proficiency_level
        FROM languages
        ORDER BY id ASC
      `);

      res.status(200).json({
        success: true,
        data: rows,
      });
    } catch (error) {
      console.error(
        "❌ Error fetching languages:",
        error
      );

      next(error);
    }
  }
);

// =====================================================
// GET HOBBIES
// GET /api/portfolio/hobbies
// =====================================================

router.get(
  "/hobbies",
  async (req, res, next) => {
    try {
      const [rows] = await pool.query(`
        SELECT id,
               hobby_name,
               hobby_name AS name,
               icon
        FROM hobbies
        ORDER BY id ASC
      `);

      res.status(200).json({
        success: true,
        data: rows,
      });
    } catch (error) {
      console.error(
        "❌ Error fetching hobbies:",
        error
      );

      next(error);
    }
  }
);

// =====================================================
// GET PERSONAL INFORMATION
// GET /api/portfolio/personal
// =====================================================

router.get(
  "/personal",
  async (req, res, next) => {
    try {
      const [rows] = await pool.query(`
        SELECT *
        FROM personal_info
        ORDER BY id DESC
        LIMIT 1
      `);

      res.status(200).json({
        success: true,
        data:
          rows.length > 0
            ? rows[0]
            : null,
      });
    } catch (error) {
      console.error(
        "❌ Error fetching personal information:",
        error
      );

      next(error);
    }
  }
);

// =====================================================
// GET CURRENT THEME
// GET /api/portfolio/theme
// =====================================================

router.get(
  "/theme",
  async (req, res, next) => {
    try {
      const [rows] = await pool.query(
        "SELECT setting_value FROM portfolio_settings WHERE setting_key = 'theme' LIMIT 1"
      );
      const theme = rows.length > 0 ? rows[0].setting_value : "purple";
      res.status(200).json({
        success: true,
        theme,
      });
    } catch (error) {
      console.error("❌ Error fetching theme:", error);
      next(error);
    }
  }
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;