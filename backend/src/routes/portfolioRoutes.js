const express = require("express");

const router = express.Router();

const { pool } = require("../config/database");


// =====================================================
// GET COMPLETE PORTFOLIO
// =====================================================

router.get("/", async (req, res, next) => {
  try {

    // -----------------------------------------------
    // Personal Information
    // -----------------------------------------------

    const [personalRows] = await pool.query(
      `
      SELECT *
      FROM personal_info
      ORDER BY id DESC
      LIMIT 1
      `
    );


    // -----------------------------------------------
    // Projects
    // -----------------------------------------------

    const [projectRows] = await pool.query(
      `
      SELECT *
      FROM projects
      ORDER BY id DESC
      `
    );


    // -----------------------------------------------
    // Education
    // -----------------------------------------------

    const [educationRows] = await pool.query(
      `
      SELECT *
      FROM education
      ORDER BY id DESC
      `
    );


    // -----------------------------------------------
    // Skills
    // -----------------------------------------------

    const [skillRows] = await pool.query(
      `
      SELECT *
      FROM skills
      ORDER BY id ASC
      `
    );


    // -----------------------------------------------
    // Certifications
    // -----------------------------------------------

    const [certificationRows] = await pool.query(
      `
      SELECT *
      FROM certifications
      ORDER BY id DESC
      `
    );


    // -----------------------------------------------
    // Languages
    // -----------------------------------------------

    const [languageRows] = await pool.query(
      `
      SELECT *
      FROM languages
      ORDER BY id ASC
      `
    );


    // -----------------------------------------------
    // Hobbies
    // -----------------------------------------------

    const [hobbyRows] = await pool.query(
      `
      SELECT *
      FROM hobbies
      ORDER BY id ASC
      `
    );


    // =================================================
    // FORMAT SKILLS
    // =================================================

    const skills = {
      languages: [],
      frontend: [],
      backend: [],
      database: [],
      tools: [],
      coreSubjects: []
    };


    skillRows.forEach((skill) => {

      if (skills[skill.category]) {
        skills[skill.category].push(
          skill.skill_name
        );
      }

    });


    // =================================================
    // RESPONSE
    // =================================================

    res.status(200).json({
      success: true,

      data: {

        personalInfo:
          personalRows.length > 0
            ? personalRows[0]
            : null,

        projects: projectRows,

        education: educationRows,

        skills,

        certifications:
          certificationRows,

        languages:
          languageRows,

        hobbies:
          hobbyRows

      }
    });

  } catch (error) {

    console.error(
      "❌ Error fetching portfolio:",
      error
    );

    next(error);
  }
});


// =====================================================
// GET PROJECTS
// =====================================================

router.get("/projects", async (req, res, next) => {

  try {

    const [rows] = await pool.query(
      `
      SELECT *
      FROM projects
      ORDER BY id DESC
      `
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {

    next(error);

  }

});


// =====================================================
// GET EDUCATION
// =====================================================

router.get("/education", async (req, res, next) => {

  try {

    const [rows] = await pool.query(
      `
      SELECT *
      FROM education
      ORDER BY id DESC
      `
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {

    next(error);

  }

});


// =====================================================
// GET SKILLS
// =====================================================

router.get("/skills", async (req, res, next) => {

  try {

    const [rows] = await pool.query(
      `
      SELECT *
      FROM skills
      ORDER BY id ASC
      `
    );

    const skills = {
      languages: [],
      frontend: [],
      backend: [],
      database: [],
      tools: [],
      coreSubjects: []
    };

    rows.forEach((skill) => {

      if (skills[skill.category]) {

        skills[skill.category].push(
          skill.skill_name
        );

      }

    });

    res.json({
      success: true,
      data: skills
    });

  } catch (error) {

    next(error);

  }

});


// =====================================================
// GET CERTIFICATIONS
// =====================================================

router.get(
  "/certifications",
  async (req, res, next) => {

    try {

      const [rows] = await pool.query(
        `
        SELECT *
        FROM certifications
        ORDER BY id DESC
        `
      );

      res.json({
        success: true,
        data: rows
      });

    } catch (error) {

      next(error);

    }

  }
);


// =====================================================
// GET LANGUAGES
// =====================================================

router.get(
  "/languages",
  async (req, res, next) => {

    try {

      const [rows] = await pool.query(
        `
        SELECT *
        FROM languages
        ORDER BY id ASC
        `
      );

      res.json({
        success: true,
        data: rows
      });

    } catch (error) {

      next(error);

    }

  }
);


// =====================================================
// GET HOBBIES
// =====================================================

router.get(
  "/hobbies",
  async (req, res, next) => {

    try {

      const [rows] = await pool.query(
        `
        SELECT *
        FROM hobbies
        ORDER BY id ASC
        `
      );

      res.json({
        success: true,
        data: rows
      });

    } catch (error) {

      next(error);

    }

  }
);


// =====================================================
// GET PERSONAL INFORMATION
// =====================================================

router.get(
  "/personal",
  async (req, res, next) => {

    try {

      const [rows] = await pool.query(
        `
        SELECT *
        FROM personal_info
        ORDER BY id DESC
        LIMIT 1
        `
      );

      res.json({
        success: true,
        data:
          rows.length > 0
            ? rows[0]
            : null
      });

    } catch (error) {

      next(error);

    }

  }
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;