const { pool } = require("../config/database");

// =========================================
// GET PERSONAL INFORMATION
// =========================================

const getPersonalInfo = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM personal_info ORDER BY id DESC LIMIT 1"
    );

    res.status(200).json({
      success: true,
      data: rows[0] || null
    });
  } catch (error) {
    next(error);
  }
};


// =========================================
// GET EDUCATION
// =========================================

const getEducation = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM education ORDER BY id ASC"
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};


// =========================================
// GET ALL SKILLS
// =========================================

const getSkills = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM skills ORDER BY id ASC"
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
        skills[skill.category].push(skill.skill_name);
      }
    });

    res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    next(error);
  }
};


// =========================================
// GET PROJECTS
// =========================================

const getProjects = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM projects ORDER BY id ASC"
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};


// =========================================
// GET HOBBIES
// =========================================

const getHobbies = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM hobbies ORDER BY id ASC"
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};


// =========================================
// GET LANGUAGES
// =========================================

const getLanguages = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM languages ORDER BY id ASC"
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};


// =========================================
// GET CERTIFICATIONS
// =========================================

const getCertifications = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM certifications ORDER BY id ASC"
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};


// =========================================
// GET COMPLETE PORTFOLIO
// =========================================

const getPortfolio = async (req, res, next) => {
  try {
    const [
      [personal],
      [education],
      [skillsRows],
      [projects],
      [hobbies],
      [languages],
      [certifications]
    ] = await Promise.all([
      pool.query(
        "SELECT * FROM personal_info ORDER BY id DESC LIMIT 1"
      ),

      pool.query(
        "SELECT * FROM education ORDER BY id ASC"
      ),

      pool.query(
        "SELECT * FROM skills ORDER BY id ASC"
      ),

      pool.query(
        "SELECT * FROM projects ORDER BY id ASC"
      ),

      pool.query(
        "SELECT * FROM hobbies ORDER BY id ASC"
      ),

      pool.query(
        "SELECT * FROM languages ORDER BY id ASC"
      ),

      pool.query(
        "SELECT * FROM certifications ORDER BY id ASC"
      )
    ]);

    const skills = {
      languages: [],
      frontend: [],
      backend: [],
      database: [],
      tools: [],
      coreSubjects: []
    };

    skillsRows.forEach((skill) => {
      if (skills[skill.category]) {
        skills[skill.category].push(skill.skill_name);
      }
    });

    const data = {
      name: personal[0]?.name || "",
      role: personal[0]?.role || "",
      about: personal[0]?.about || "",

      education,

      skills,

      projects,

      hobbies: hobbies.map((item) => item.hobby_name),

      languages,

      certifications: certifications.map(
        (item) => item.certification_name
      ),

      contact: {
        email: personal[0]?.email || "",
        linkedin: personal[0]?.linkedin || "",
        location: personal[0]?.location || "",
        phone: personal[0]?.phone || ""
      }
    };

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getPortfolio,
  getPersonalInfo,
  getEducation,
  getSkills,
  getProjects,
  getHobbies,
  getLanguages,
  getCertifications
};