const { pool } = require("../config/database");

// =====================================================
// HELPER - FORMAT SKILLS
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
// GET PERSONAL INFORMATION
// =====================================================

const getPersonalInfo = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM personal_info
      ORDER BY id DESC
      LIMIT 1
    `);

    res.status(200).json({
      success: true,
      data: rows.length > 0 ? rows[0] : null,
    });
  } catch (error) {
    console.error(
      "❌ Error fetching personal information:",
      error
    );

    next(error);
  }
};

// =====================================================
// GET EDUCATION
// =====================================================

const getEducation = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM education
      ORDER BY id ASC
    `);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error(
      "❌ Error fetching education:",
      error
    );

    next(error);
  }
};

// =====================================================
// GET ALL SKILLS
// =====================================================

const getSkills = async (req, res, next) => {
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
};

// =====================================================
// GET PROJECTS
// =====================================================

const getProjects = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM projects
      ORDER BY id ASC
    `);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error(
      "❌ Error fetching projects:",
      error
    );

    next(error);
  }
};

// =====================================================
// GET HOBBIES
// =====================================================

const getHobbies = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM hobbies
      ORDER BY id ASC
    `);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error(
      "❌ Error fetching hobbies:",
      error
    );

    next(error);
  }
};

// =====================================================
// GET LANGUAGES
// =====================================================

const getLanguages = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM languages
      ORDER BY id ASC
    `);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error(
      "❌ Error fetching languages:",
      error
    );

    next(error);
  }
};

// =====================================================
// GET CERTIFICATIONS
// =====================================================

const getCertifications = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM certifications
      ORDER BY id DESC
    `);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error(
      "❌ Error fetching certifications:",
      error
    );

    next(error);
  }
};

// =====================================================
// GET COMPLETE PORTFOLIO
// =====================================================

const getPortfolio = async (req, res, next) => {
  try {
    const [
      [personalRows],
      [education],
      [skillsRows],
      [projects],
      [hobbies],
      [languages],
      [certifications],
    ] = await Promise.all([
      // PERSONAL
      pool.query(`
        SELECT *
        FROM personal_info
        ORDER BY id DESC
        LIMIT 1
      `),

      // EDUCATION
      pool.query(`
        SELECT *
        FROM education
        ORDER BY id ASC
      `),

      // SKILLS
      pool.query(`
        SELECT *
        FROM skills
        ORDER BY id ASC
      `),

      // PROJECTS
      pool.query(`
        SELECT *
        FROM projects
        ORDER BY id ASC
      `),

      // HOBBIES
      pool.query(`
        SELECT *
        FROM hobbies
        ORDER BY id ASC
      `),

      // LANGUAGES
      pool.query(`
        SELECT *
        FROM languages
        ORDER BY id ASC
      `),

      // CERTIFICATIONS
      pool.query(`
        SELECT *
        FROM certifications
        ORDER BY id DESC
      `),
    ]);

    // =================================================
    // PERSONAL DATA
    // =================================================

    const personal =
      personalRows.length > 0
        ? personalRows[0]
        : null;

    // =================================================
    // FORMAT SKILLS
    // =================================================

    const skills = formatSkills(skillsRows);

    // =================================================
    // FINAL PORTFOLIO DATA
    // =================================================

    const data = {
      // -----------------------------------------------
      // PERSONAL INFORMATION
      // -----------------------------------------------

      personalInfo: personal,

      // -----------------------------------------------
      // SHORT PERSONAL DATA
      // -----------------------------------------------

      name: personal?.name || "",
      role: personal?.role || "",
      about: personal?.about || "",

      // -----------------------------------------------
      // EDUCATION
      // -----------------------------------------------

      education,

      // -----------------------------------------------
      // SKILLS
      // -----------------------------------------------

      skills,

      // -----------------------------------------------
      // PROJECTS
      // -----------------------------------------------

      projects,

      // -----------------------------------------------
      // HOBBIES
      // -----------------------------------------------

      hobbies,

      // -----------------------------------------------
      // LANGUAGES
      // -----------------------------------------------

      languages,

      // -----------------------------------------------
      // CERTIFICATIONS
      // -----------------------------------------------

      certifications,

      // -----------------------------------------------
      // CONTACT
      // -----------------------------------------------

      contact: {
        email: personal?.email || "",
        linkedin: personal?.linkedin || "",
        location: personal?.location || "",
        phone: personal?.phone || "",
        github: personal?.github || "",
        instagram: personal?.instagram || "",
        youtube: personal?.youtube || "",
      },
    };

    // =================================================
    // RESPONSE
    // =================================================

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "❌ Error fetching complete portfolio:",
      error
    );

    next(error);
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getPortfolio,
  getPersonalInfo,
  getEducation,
  getSkills,
  getProjects,
  getHobbies,
  getLanguages,
  getCertifications,
};