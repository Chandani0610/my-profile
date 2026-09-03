const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const { pool } = require("../config/database");


// =========================================
// CREATE ADMIN
// =========================================

const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters"
      });
    }

    const [existing] = await pool.query(
      "SELECT id FROM admins WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.query(
      `INSERT INTO admins (name, email, password)
       VALUES (?, ?, ?)`,
      [name, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      adminId: result.insertId
    });

  } catch (error) {
    next(error);
  }
};


// =========================================
// LOGIN
// =========================================

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const [admins] = await pool.query(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const admin = admins[0];

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const sessionToken = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await pool.query(
      `INSERT INTO admin_sessions
       (admin_id, session_token, expires_at)
       VALUES (?, ?, ?)`,
      [
        admin.id,
        sessionToken,
        expiresAt
      ]
    );

    res.cookie("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: "Login successful",

      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email
      }
    });

  } catch (error) {
    next(error);
  }
};


// =========================================
// LOGOUT
// =========================================

const logoutAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.admin_session;

    if (token) {
      await pool.query(
        "DELETE FROM admin_sessions WHERE session_token = ?",
        [token]
      );
    }

    res.clearCookie("admin_session");

    res.json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    next(error);
  }
};


// =========================================
// CURRENT ADMIN
// =========================================

const getCurrentAdmin = async (req, res) => {
  res.json({
    success: true,
    admin: req.admin
  });
};


// =========================================
// CREATE PROJECT
// =========================================

const createProject = async (req, res, next) => {
  try {
    const {
      title,
      icon,
      tech,
      description,
      github,
      demo
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Project title is required"
      });
    }

    const [result] = await pool.query(
      `INSERT INTO projects
       (title, icon, tech, description, github, demo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title,
        icon || "",
        tech || "",
        description || "",
        github || "#",
        demo || "#"
      ]
    );

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      id: result.insertId
    });

  } catch (error) {
    next(error);
  }
};


// =========================================
// UPDATE PROJECT
// =========================================

const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      title,
      icon,
      tech,
      description,
      github,
      demo
    } = req.body;

    const [result] = await pool.query(
      `UPDATE projects
       SET title = ?,
           icon = ?,
           tech = ?,
           description = ?,
           github = ?,
           demo = ?
       WHERE id = ?`,
      [
        title,
        icon,
        tech,
        description,
        github,
        demo,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.json({
      success: true,
      message: "Project updated successfully"
    });

  } catch (error) {
    next(error);
  }
};


// =========================================
// DELETE PROJECT
// =========================================

const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM projects WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.json({
      success: true,
      message: "Project deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};


// =========================================
// CREATE EDUCATION
// =========================================

const createEducation = async (req, res, next) => {
  try {
    const {
      degree,
      college,
      marks,
      year
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO education
       (degree, college, marks, year)
       VALUES (?, ?, ?, ?)`,
      [
        degree,
        college,
        marks,
        year
      ]
    );

    res.status(201).json({
      success: true,
      message: "Education added successfully",
      id: result.insertId
    });

  } catch (error) {
    next(error);
  }
};


// =========================================
// UPDATE EDUCATION
// =========================================

const updateEducation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      degree,
      college,
      marks,
      year
    } = req.body;

    const [result] = await pool.query(
      `UPDATE education
       SET degree = ?,
           college = ?,
           marks = ?,
           year = ?
       WHERE id = ?`,
      [
        degree,
        college,
        marks,
        year,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Education not found"
      });
    }

    res.json({
      success: true,
      message: "Education updated successfully"
    });

  } catch (error) {
    next(error);
  }
};


// =========================================
// DELETE EDUCATION
// =========================================

const deleteEducation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM education WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Education not found"
      });
    }

    res.json({
      success: true,
      message: "Education deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};


// =========================================
// CREATE SKILL
// =========================================

const createSkill = async (req, res, next) => {
  try {
    const {
      category,
      skill_name
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO skills
       (category, skill_name)
       VALUES (?, ?)`,
      [category, skill_name]
    );

    res.status(201).json({
      success: true,
      message: "Skill added successfully",
      id: result.insertId
    });

  } catch (error) {
    next(error);
  }
};


// =========================================
// UPDATE SKILL
// =========================================

const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      category,
      skill_name
    } = req.body;

    const [result] = await pool.query(
      `UPDATE skills
       SET category = ?,
           skill_name = ?
       WHERE id = ?`,
      [
        category,
        skill_name,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Skill not found"
      });
    }

    res.json({
      success: true,
      message: "Skill updated successfully"
    });

  } catch (error) {
    next(error);
  }
};


// =========================================
// DELETE SKILL
// =========================================

const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM skills WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Skill not found"
      });
    }

    res.json({
      success: true,
      message: "Skill deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};


// =========================================
// CREATE CERTIFICATION
// =========================================

const createCertification = async (req, res, next) => {
  try {
    const {
      certification_name
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO certifications
       (certification_name)
       VALUES (?)`,
      [certification_name]
    );

    res.status(201).json({
      success: true,
      message: "Certification added successfully",
      id: result.insertId
    });

  } catch (error) {
    next(error);
  }
};


// =========================================
// DELETE CERTIFICATION
// =========================================

const deleteCertification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM certifications WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Certification not found"
      });
    }

    res.json({
      success: true,
      message: "Certification deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};


// =========================================
// CREATE LANGUAGE
// =========================================

const createLanguage = async (req, res, next) => {
  try {
    const {
      name,
      flag,
      level
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO languages
       (name, flag, level)
       VALUES (?, ?, ?)`,
      [name, flag, level]
    );

    res.status(201).json({
      success: true,
      message: "Language added successfully",
      id: result.insertId
    });

  } catch (error) {
    next(error);
  }
};


// =========================================
// DELETE LANGUAGE
// =========================================

const deleteLanguage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM languages WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Language not found"
      });
    }

    res.json({
      success: true,
      message: "Language deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};


// =========================================
// CREATE HOBBY
// =========================================

const createHobby = async (req, res, next) => {
  try {
    const {
      hobby_name
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO hobbies
       (hobby_name)
       VALUES (?)`,
      [hobby_name]
    );

    res.status(201).json({
      success: true,
      message: "Hobby added successfully",
      id: result.insertId
    });

  } catch (error) {
    next(error);
  }
};


// =========================================
// DELETE HOBBY
// =========================================

const deleteHobby = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM hobbies WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Hobby not found"
      });
    }

    res.json({
      success: true,
      message: "Hobby deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};


// =========================================
// UPDATE PERSONAL INFO
// =========================================

const updatePersonalInfo = async (req, res, next) => {
  try {
    const {
      name,
      role,
      about,
      email,
      linkedin,
      location,
      phone
    } = req.body;

    const [existing] = await pool.query(
      "SELECT id FROM personal_info ORDER BY id DESC LIMIT 1"
    );

    if (existing.length === 0) {
      const [result] = await pool.query(
        `INSERT INTO personal_info
        (name, role, about, email, linkedin, location, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          role,
          about,
          email,
          linkedin,
          location,
          phone
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Personal information created",
        id: result.insertId
      });
    }

    await pool.query(
      `UPDATE personal_info
       SET name = ?,
           role = ?,
           about = ?,
           email = ?,
           linkedin = ?,
           location = ?,
           phone = ?
       WHERE id = ?`,
      [
        name,
        role,
        about,
        email,
        linkedin,
        location,
        phone,
        existing[0].id
      ]
    );

    res.json({
      success: true,
      message: "Personal information updated"
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
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
};