const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { pool } = require("../config/database");

// ============================================================
// UPLOAD CONFIGURATION
// ============================================================

const uploadDir = path.join(__dirname, "../uploads/certifications");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname);

    cb(null, "cert-" + uniqueSuffix + ext);
  },
});

// Allow images and PDF files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP, GIF and PDF files are allowed"
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

// ============================================================
// HELPER - DELETE UPLOADED FILE
// ============================================================

const deleteUploadedFile = (fileUrl) => {
  if (!fileUrl) return;

  try {
    const relativePath = fileUrl.startsWith("/")
      ? fileUrl.substring(1)
      : fileUrl;

    const filePath = path.join(__dirname, "..", relativePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("File delete error:", error.message);
  }
};

// ============================================================
// UPLOAD IMAGE / PDF
// ============================================================

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const fileUrl = `/uploads/certifications/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      url: fileUrl,
      data: {
        url: fileUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// RESUME UPLOAD & MANAGEMENT (ACTIVE + RECENT HISTORY)
// ============================================================

const resumeUploadDir = path.join(__dirname, "..", "uploads", "resume");
const frontendPublicResumeDir = path.join(__dirname, "..", "..", "..", "portfolio", "public", "uploads", "resume");

if (!fs.existsSync(resumeUploadDir)) {
  fs.mkdirSync(resumeUploadDir, { recursive: true });
}
if (!fs.existsSync(frontendPublicResumeDir)) {
  fs.mkdirSync(frontendPublicResumeDir, { recursive: true });
}

const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".pdf";
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `Resume_${cleanName}_${Date.now()}${ext}`);
  },
});

const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
});

// Helper to get history from portfolio_settings
const getStoredHistory = async () => {
  try {
    const [rows] = await pool.query(
      "SELECT setting_value FROM portfolio_settings WHERE setting_key = 'resume_history' LIMIT 1"
    );
    if (rows.length && rows[0].setting_value) {
      return JSON.parse(rows[0].setting_value);
    }
  } catch (err) {
    console.warn("Could not load resume_history:", err.message);
  }
  return [];
};

// Helper to save history to portfolio_settings
const saveStoredHistory = async (history) => {
  try {
    await pool.query(
      `INSERT INTO portfolio_settings (setting_key, setting_value)
       VALUES ('resume_history', ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [JSON.stringify(history)]
    );
  } catch (err) {
    console.warn("Could not save resume_history:", err.message);
  }
};

const uploadResumeFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume file uploaded",
      });
    }

    const publicResumePath = path.join(__dirname, "..", "..", "..", "portfolio", "public", "Chandani_Kumari_Resume.pdf");
    const publicVersionCopy = path.join(frontendPublicResumeDir, req.file.filename);

    // Copy to public version folder and main live resume
    try {
      fs.copyFileSync(req.file.path, publicVersionCopy);
    } catch (copyErr) {
      console.warn("Could not copy to frontend uploads/resume:", copyErr.message);
    }

    try {
      fs.copyFileSync(req.file.path, publicResumePath);
    } catch (copyErr) {
      console.warn("Could not copy to portfolio/public:", copyErr.message);
    }

    const originalName = req.file.originalname;
    const fileSize = req.file.size;
    const uploadTime = new Date().toISOString();
    const newId = "res_" + Date.now();
    const storedFilename = req.file.filename;

    const newEntry = {
      id: newId,
      filename: storedFilename,
      originalName: originalName,
      size: fileSize,
      url: `/uploads/resume/${storedFilename}`,
      publicUrl: "/Chandani_Kumari_Resume.pdf",
      uploadedAt: uploadTime,
      isActive: true,
    };

    // Load existing history and mark previous items as inactive
    const history = await getStoredHistory();
    const updatedHistory = [
      newEntry,
      ...history.map((item) => ({ ...item, isActive: false })),
    ].slice(0, 25); // retain last 25 resumes

    await saveStoredHistory(updatedHistory);

    // Also update current active resume settings
    await pool.query(
      `INSERT INTO portfolio_settings (setting_key, setting_value)
       VALUES ('resume_url', ?), ('resume_name', ?), ('resume_size', ?), ('resume_updated_at', ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);`,
      ["/Chandani_Kumari_Resume.pdf", originalName, String(fileSize), uploadTime]
    );

    res.status(200).json({
      success: true,
      message: "Resume updated and published successfully! All download links updated.",
      data: {
        active: newEntry,
        recent: updatedHistory,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getResumeInfo = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT setting_key, setting_value, updated_at
      FROM portfolio_settings
      WHERE setting_key IN ('resume_url', 'resume_name', 'resume_size', 'resume_updated_at', 'resume_history')
    `);

    const info = {};
    rows.forEach((r) => {
      info[r.setting_key] = r.setting_value;
    });

    let history = [];
    if (info.resume_history) {
      try {
        history = JSON.parse(info.resume_history);
      } catch {
        history = [];
      }
    }

    const publicResumePath = path.join(__dirname, "..", "..", "..", "portfolio", "public", "Chandani_Kumari_Resume.pdf");
    let fileExists = false;
    let size = Number(info.resume_size) || 245000;
    let updatedAt = info.resume_updated_at || new Date().toISOString();

    if (fs.existsSync(publicResumePath)) {
      fileExists = true;
      const stats = fs.statSync(publicResumePath);
      if (!info.resume_size) size = stats.size;
      if (!info.resume_updated_at) updatedAt = stats.mtime;
    }

    const activeResume = {
      id: "active",
      url: info.resume_url || "/Chandani_Kumari_Resume.pdf",
      filename: info.resume_name || "Chandani_Kumari_Resume.pdf",
      originalName: info.resume_name || "Chandani_Kumari_Resume.pdf",
      size,
      updatedAt,
      uploadedAt: updatedAt,
      exists: fileExists,
      isActive: true,
    };

    // If history is empty, seed with current active resume
    if (history.length === 0) {
      history = [activeResume];
      await saveStoredHistory(history);
    }

    res.status(200).json({
      success: true,
      data: {
        active: activeResume,
        recent: history,
      },
    });
  } catch (error) {
    next(error);
  }
};

const setActiveResume = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }

    const history = await getStoredHistory();
    const target = history.find((h) => h.id === id);

    if (!target) {
      return res.status(404).json({
        success: false,
        message: "Resume version not found in history",
      });
    }

    // Attempt to copy target file to public Chandani_Kumari_Resume.pdf
    const sourceInBackend = path.join(resumeUploadDir, target.filename);
    const sourceInPublic = path.join(frontendPublicResumeDir, target.filename);
    const destination = path.join(__dirname, "..", "..", "..", "portfolio", "public", "Chandani_Kumari_Resume.pdf");

    let copied = false;
    if (fs.existsSync(sourceInBackend)) {
      fs.copyFileSync(sourceInBackend, destination);
      copied = true;
    } else if (fs.existsSync(sourceInPublic)) {
      fs.copyFileSync(sourceInPublic, destination);
      copied = true;
    }

    const updatedTime = new Date().toISOString();
    const updatedHistory = history.map((item) => ({
      ...item,
      isActive: item.id === id,
    }));

    await saveStoredHistory(updatedHistory);

    await pool.query(
      `INSERT INTO portfolio_settings (setting_key, setting_value)
       VALUES ('resume_url', ?), ('resume_name', ?), ('resume_size', ?), ('resume_updated_at', ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);`,
      ["/Chandani_Kumari_Resume.pdf", target.originalName || target.filename, String(target.size || 0), updatedTime]
    );

    const activeResume = {
      ...target,
      url: "/Chandani_Kumari_Resume.pdf",
      isActive: true,
      updatedAt: updatedTime,
    };

    res.status(200).json({
      success: true,
      message: `"${target.originalName || target.filename}" is now the active live resume!`,
      data: {
        active: activeResume,
        recent: updatedHistory,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }

    const history = await getStoredHistory();
    const target = history.find((h) => h.id === id);

    if (!target) {
      return res.status(404).json({
        success: false,
        message: "Resume version not found",
      });
    }

    if (target.isActive) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the currently active resume. Please activate a different version first.",
      });
    }

    // Delete file if exists
    if (target.filename) {
      const backendFile = path.join(resumeUploadDir, target.filename);
      const publicFile = path.join(frontendPublicResumeDir, target.filename);
      try {
        if (fs.existsSync(backendFile)) fs.unlinkSync(backendFile);
      } catch (err) {
        console.warn("Could not delete backend resume file:", err.message);
      }
      try {
        if (fs.existsSync(publicFile)) fs.unlinkSync(publicFile);
      } catch (err) {
        console.warn("Could not delete public resume file:", err.message);
      }
    }

    const updatedHistory = history.filter((h) => h.id !== id);
    await saveStoredHistory(updatedHistory);

    res.status(200).json({
      success: true,
      message: "Resume version deleted successfully",
      data: {
        recent: updatedHistory,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// REGISTER ADMIN
// ============================================================

const registerAdmin = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters",
      });
    }

    const [existing] = await pool.query(
      "SELECT id FROM admins WHERE email = ?",
      [email.trim()]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.query(
      `INSERT INTO admins
       (name, email, password)
       VALUES (?, ?, ?)`,
      [
        name.trim(),
        email.trim(),
        hashedPassword,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      adminId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// LOGIN ADMIN
// ============================================================

const loginAdmin = async (req, res, next) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const [admins] = await pool.query(
      "SELECT * FROM admins WHERE email = ?",
      [email.trim()]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
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
        message: "Invalid email or password",
      });
    }

    const sessionToken = crypto
      .randomBytes(32)
      .toString("hex");

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
        expiresAt,
      ]
    );

    res.cookie("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      token: sessionToken,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// LOGOUT ADMIN
// ============================================================

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
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CURRENT ADMIN
// ============================================================

const getCurrentAdmin = async (req, res) => {
  res.json({
    success: true,
    admin: req.admin,
  });
};

// ============================================================
// DASHBOARD STATS
// ============================================================

const getDashboardStats = async (req, res, next) => {
  try {
    const [[{ projectCount }]] = await pool.query("SELECT COUNT(*) AS projectCount FROM projects");
    const [[{ educationCount }]] = await pool.query("SELECT COUNT(*) AS educationCount FROM education");
    const [[{ skillCount }]] = await pool.query("SELECT COUNT(*) AS skillCount FROM skills");
    const [[{ certCount }]] = await pool.query("SELECT COUNT(*) AS certCount FROM certifications");
    const [[{ langCount }]] = await pool.query("SELECT COUNT(*) AS langCount FROM languages");
    const [[{ hobbyCount }]] = await pool.query("SELECT COUNT(*) AS hobbyCount FROM hobbies");

    res.json({
      success: true,
      data: {
        projects: Number(projectCount) || 0,
        education: Number(educationCount) || 0,
        skills: Number(skillCount) || 0,
        certifications: Number(certCount) || 0,
        languages: Number(langCount) || 0,
        hobbies: Number(hobbyCount) || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// PROJECTS
// ============================================================

// GET ALL PROJECTS
const getProjects = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM projects ORDER BY id DESC"
    );
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE PROJECT
const createProject = async (req, res, next) => {
  try {
    const {
      title,
      icon,
      tech,
      description,
      github,
      demo,
      image,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO projects
       (title, icon, tech, description, github, demo, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        icon || "",
        tech || "",
        description || "",
        github || "#",
        demo || "#",
        image || null,
      ]
    );

    const [newProject] = await pool.query(
      "SELECT * FROM projects WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: newProject[0],
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE PROJECT
const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      title,
      icon,
      tech,
      description,
      github,
      demo,
      image,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    const [result] = await pool.query(
      `UPDATE projects
       SET title = ?,
           icon = ?,
           tech = ?,
           description = ?,
           github = ?,
           demo = ?,
           image = ?
       WHERE id = ?`,
      [
        title.trim(),
        icon || "",
        tech || "",
        description || "",
        github || "#",
        demo || "#",
        image || null,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const [updatedProject] = await pool.query(
      "SELECT * FROM projects WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject[0],
    });
  } catch (error) {
    next(error);
  }
};

// DELETE PROJECT
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
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// EDUCATION
// ============================================================

// CREATE EDUCATION
const createEducation = async (req, res, next) => {
  try {
    const {
      degree,
      college,
      marks,
      year,
    } = req.body;

    if (!degree || !college) {
      return res.status(400).json({
        success: false,
        message: "Degree and college are required",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO education
       (degree, college, marks, year)
       VALUES (?, ?, ?, ?)`,
      [
        degree.trim(),
        college.trim(),
        marks || "",
        year || "",
      ]
    );

    const [newEducation] = await pool.query(
      "SELECT * FROM education WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Education added successfully",
      data: newEducation[0],
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE EDUCATION
const updateEducation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      degree,
      college,
      marks,
      year,
    } = req.body;

    if (!degree || !college) {
      return res.status(400).json({
        success: false,
        message: "Degree and college are required",
      });
    }

    const [result] = await pool.query(
      `UPDATE education
       SET degree = ?,
           college = ?,
           marks = ?,
           year = ?
       WHERE id = ?`,
      [
        degree.trim(),
        college.trim(),
        marks || "",
        year || "",
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    const [updatedEducation] = await pool.query(
      "SELECT * FROM education WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Education updated successfully",
      data: updatedEducation[0],
    });
  } catch (error) {
    next(error);
  }
};

// DELETE EDUCATION
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
        message: "Education not found",
      });
    }

    res.json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// SKILLS
// ============================================================

// CREATE SKILL
const createSkill = async (req, res, next) => {
  try {
    const {
      category,
      skill_name,
    } = req.body;

    if (!category || !skill_name) {
      return res.status(400).json({
        success: false,
        message: "Category and skill name are required",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO skills
       (category, skill_name)
       VALUES (?, ?)`,
      [
        category,
        skill_name.trim(),
      ]
    );

    res.status(201).json({
      success: true,
      message: "Skill added successfully",
      id: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE SKILL
const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      category,
      skill_name,
    } = req.body;

    if (!category || !skill_name) {
      return res.status(400).json({
        success: false,
        message: "Category and skill name are required",
      });
    }

    const [result] = await pool.query(
      `UPDATE skills
       SET category = ?,
           skill_name = ?
       WHERE id = ?`,
      [
        category,
        skill_name.trim(),
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.json({
      success: true,
      message: "Skill updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE SKILL
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
        message: "Skill not found",
      });
    }

    res.json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// BULK UPDATE SKILLS
const updateSkillsByCategory = async (
  req,
  res,
  next
) => {
  try {
    const { category } = req.params;
    const { skills } = req.body;

    const validCategories = [
      "languages",
      "frontend",
      "backend",
      "database",
      "tools",
      "coreSubjects",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid category. Must be one of: " +
          validCategories.join(", "),
      });
    }

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: "Skills must be an array",
      });
    }

    await pool.query(
      "DELETE FROM skills WHERE category = ?",
      [category]
    );

    if (skills.length === 0) {
      return res.json({
        success: true,
        message: `All skills removed from ${category}`,
        data: {
          category,
          skills: [],
        },
      });
    }

    const cleanedSkills = skills
      .map((skill) =>
        typeof skill === "string"
          ? skill.trim()
          : ""
      )
      .filter(Boolean);

    if (cleanedSkills.length > 0) {
      const insertPromises = cleanedSkills.map(
        (skillName) =>
          pool.query(
            `INSERT INTO skills
             (category, skill_name)
             VALUES (?, ?)`,
            [
              category,
              skillName,
            ]
          )
      );

      await Promise.all(insertPromises);
    }

    const [updatedSkills] = await pool.query(
      `SELECT skill_name
       FROM skills
       WHERE category = ?
       ORDER BY id ASC`,
      [category]
    );

    res.json({
      success: true,
      message: `Skills updated successfully for ${category}`,
      data: {
        category,
        skills: updatedSkills.map(
          (row) => row.skill_name
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CERTIFICATIONS
// ============================================================

// GET CERTIFICATIONS
const getCertifications = async (
  req,
  res,
  next
) => {
  try {
    const [certifications] = await pool.query(
      `SELECT *,
              name AS certification_name
       FROM certifications
       ORDER BY id DESC`
    );

    res.json({
      success: true,
      data: certifications,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE CERTIFICATION
const createCertification = async (
  req,
  res,
  next
) => {
  try {
    const {
      credential,
      url,
      image,
      description,
    } = req.body;

    const certName = (req.body.name || req.body.certification_name || "").trim();
    const certIssuer = (req.body.issuer || "Self").trim();

    if (!certName) {
      return res.status(400).json({
        success: false,
        message: "Certification name is required",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO certifications
       (name, issuer, credential, url, image, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        certName,
        certIssuer,
        credential?.trim() || null,
        url?.trim() || null,
        image?.trim() || null,
        description?.trim() || null,
      ]
    );

    const [newCertification] =
      await pool.query(
        `SELECT *, name AS certification_name
         FROM certifications
         WHERE id = ?`,
        [result.insertId]
      );

    res.status(201).json({
      success: true,
      message: "Certification added successfully",
      data: newCertification[0],
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE CERTIFICATION
const updateCertification = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query(
      `SELECT *
       FROM certifications
       WHERE id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    const certName = (req.body.name || req.body.certification_name || existing[0].name || "").trim();
    const certIssuer = (req.body.issuer || existing[0].issuer || "Self").trim();
    const credential = req.body.credential !== undefined ? (req.body.credential?.trim() || null) : existing[0].credential;
    const url = req.body.url !== undefined ? (req.body.url?.trim() || null) : existing[0].url;
    const description = req.body.description !== undefined ? (req.body.description?.trim() || null) : existing[0].description;
    const oldImage = existing[0].image;
    const newImage = req.body.image !== undefined ? (req.body.image?.trim() || null) : oldImage;

    if (!certName) {
      return res.status(400).json({
        success: false,
        message: "Certification name is required",
      });
    }

    await pool.query(
      `UPDATE certifications
       SET name = ?,
           issuer = ?,
           credential = ?,
           url = ?,
           image = ?,
           description = ?
       WHERE id = ?`,
      [
        certName,
        certIssuer,
        credential,
        url,
        newImage,
        description,
        id,
      ]
    );

    // Delete old image if replaced
    if (
      oldImage &&
      newImage &&
      oldImage !== newImage
    ) {
      deleteUploadedFile(oldImage);
    }

    const [updatedCertification] =
      await pool.query(
        `SELECT *, name AS certification_name
         FROM certifications
         WHERE id = ?`,
        [id]
      );

    res.json({
      success: true,
      message: "Certification updated successfully",
      data: updatedCertification[0],
    });
  } catch (error) {
    next(error);
  }
};

// DELETE CERTIFICATION
const deleteCertification = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query(
      `SELECT *
       FROM certifications
       WHERE id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    if (existing[0].image) {
      deleteUploadedFile(
        existing[0].image
      );
    }

    await pool.query(
      "DELETE FROM certifications WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Certification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// LANGUAGES
// ============================================================

const defaultLanguageFlags = {
  English: "🇬🇧",
  Hindi: "🇮🇳",
  Maithili: "🧡",
  Spanish: "🇪🇸",
  French: "🇫🇷",
  German: "🇩🇪",
  Chinese: "🇨🇳",
  Japanese: "🇯🇵",
  Korean: "🇰🇷",
  Russian: "🇷🇺",
  Arabic: "🇸🇦",
  Portuguese: "🇵🇹",
  Italian: "🇮🇹",
  Dutch: "🇳🇱",
  Bengali: "🇧🇩",
  Urdu: "🇵🇰",
  Tamil: "🇮🇳",
  Telugu: "🇮🇳",
  Marathi: "🇮🇳",
  Gujarati: "🇮🇳",
  Punjabi: "🇮🇳",
  Nepali: "🇳🇵",
};

// GET LANGUAGES
const getLanguages = async (
  req,
  res,
  next
) => {
  try {
    const [languages] = await pool.query(
      `SELECT id,
              name,
              name AS language_name,
              flag,
              level,
              level AS proficiency_level
       FROM languages
       ORDER BY id ASC`
    );

    res.json({
      success: true,
      data: languages,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE LANGUAGE
const createLanguage = async (
  req,
  res,
  next
) => {
  try {
    const rawName = req.body.name || req.body.language_name;
    const rawLevel = req.body.level || req.body.proficiency_level;
    const rawFlag = req.body.flag;

    if (!rawName || !rawName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Language name is required",
      });
    }

    const cleanName = rawName.trim();
    const cleanLevel = (rawLevel || "Fluent").trim();
    const cleanFlag = (rawFlag && rawFlag.trim()) || defaultLanguageFlags[cleanName] || "🌐";

    const [result] = await pool.query(
      `INSERT INTO languages
       (name, flag, level)
       VALUES (?, ?, ?)`,
      [
        cleanName,
        cleanFlag,
        cleanLevel,
      ]
    );

    const [newLanguage] =
      await pool.query(
        `SELECT id,
                name,
                name AS language_name,
                flag,
                level,
                level AS proficiency_level
         FROM languages WHERE id = ?`,
        [result.insertId]
      );

    res.status(201).json({
      success: true,
      message: "Language added successfully",
      data: newLanguage[0],
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE LANGUAGE
const updateLanguage = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const rawName = req.body.name || req.body.language_name;
    const rawLevel = req.body.level || req.body.proficiency_level;
    const rawFlag = req.body.flag;

    if (!rawName || !rawName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Language name is required",
      });
    }

    const cleanName = rawName.trim();
    const cleanLevel = (rawLevel || "Fluent").trim();
    const cleanFlag = (rawFlag && rawFlag.trim()) || defaultLanguageFlags[cleanName] || "🌐";

    const [result] = await pool.query(
      `UPDATE languages
       SET name = ?,
           flag = ?,
           level = ?
       WHERE id = ?`,
      [
        cleanName,
        cleanFlag,
        cleanLevel,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Language not found",
      });
    }

    const [updatedLanguage] =
      await pool.query(
        `SELECT id,
                name,
                name AS language_name,
                flag,
                level,
                level AS proficiency_level
         FROM languages WHERE id = ?`,
        [id]
      );

    res.json({
      success: true,
      message: "Language updated successfully",
      data: updatedLanguage[0],
    });
  } catch (error) {
    next(error);
  }
};

// DELETE LANGUAGE
const deleteLanguage = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM languages WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Language not found",
      });
    }

    res.json({
      success: true,
      message: "Language deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// HOBBIES
// ============================================================

// GET HOBBIES
const getHobbies = async (
  req,
  res,
  next
) => {
  try {
    const [hobbies] = await pool.query(
      `SELECT id,
              hobby_name,
              hobby_name AS name,
              icon
       FROM hobbies
       ORDER BY id ASC`
    );

    res.json({
      success: true,
      data: hobbies,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE HOBBY
const createHobby = async (
  req,
  res,
  next
) => {
  try {
    const rawHobbyName = req.body.hobby_name || req.body.name;
    const rawIcon = req.body.icon;

    if (!rawHobbyName || !rawHobbyName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Hobby name is required",
      });
    }

    const cleanHobbyName = rawHobbyName.trim();
    const cleanIcon = (rawIcon && rawIcon.trim()) || "🎯";

    const [result] = await pool.query(
      `INSERT INTO hobbies
       (hobby_name, icon)
       VALUES (?, ?)`,
      [cleanHobbyName, cleanIcon]
    );

    const [newHobby] =
      await pool.query(
        `SELECT id,
                hobby_name,
                hobby_name AS name,
                icon
         FROM hobbies WHERE id = ?`,
        [result.insertId]
      );

    res.status(201).json({
      success: true,
      message: "Hobby added successfully",
      data: newHobby[0],
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE HOBBY
const updateHobby = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const rawHobbyName = req.body.hobby_name || req.body.name;
    const rawIcon = req.body.icon;

    if (!rawHobbyName || !rawHobbyName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Hobby name is required",
      });
    }

    const cleanHobbyName = rawHobbyName.trim();
    const cleanIcon = (rawIcon && rawIcon.trim()) || "🎯";

    const [result] = await pool.query(
      `UPDATE hobbies
       SET hobby_name = ?,
           icon = ?
       WHERE id = ?`,
      [
        cleanHobbyName,
        cleanIcon,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Hobby not found",
      });
    }

    const [updatedHobby] =
      await pool.query(
        `SELECT id,
                hobby_name,
                hobby_name AS name,
                icon
         FROM hobbies WHERE id = ?`,
        [id]
      );

    res.json({
      success: true,
      message: "Hobby updated successfully",
      data: updatedHobby[0],
    });
  } catch (error) {
    next(error);
  }
};

// DELETE HOBBY
const deleteHobby = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM hobbies WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Hobby not found",
      });
    }

    res.json({
      success: true,
      message: "Hobby deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// PERSONAL INFORMATION
// ============================================================

// GET PERSONAL INFORMATION
const getPersonalInfo = async (
  req,
  res,
  next
) => {
  try {
    const [rows] = await pool.query(
      `SELECT id,
              name,
              role,
              role AS title,
              about,
              email,
              linkedin,
              location,
              phone,
              created_at,
              updated_at
       FROM personal_info
       ORDER BY id DESC
       LIMIT 1`
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Personal information not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE PERSONAL INFORMATION
const updatePersonalInfo = async (
  req,
  res,
  next
) => {
  try {
    const name = req.body.name || "";
    const role = req.body.role || req.body.title || "";
    const about = req.body.about || "";
    const email = req.body.email || "";
    const linkedin = req.body.linkedin || "";
    const location = req.body.location || "";
    const phone = req.body.phone || "";

    const [existing] = await pool.query(
      `SELECT id
       FROM personal_info
       ORDER BY id DESC
       LIMIT 1`
    );

    // --------------------------------------------------------
    // CREATE
    // --------------------------------------------------------

    if (existing.length === 0) {
      const [result] = await pool.query(
        `INSERT INTO personal_info
         (
           name,
           role,
           about,
           email,
           linkedin,
           location,
           phone
         )
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          role,
          about,
          email,
          linkedin,
          location,
          phone,
        ]
      );

      const [newInfo] =
        await pool.query(
          `SELECT id,
                  name,
                  role,
                  role AS title,
                  about,
                  email,
                  linkedin,
                  location,
                  phone,
                  created_at,
                  updated_at
           FROM personal_info WHERE id = ?`,
          [result.insertId]
        );

      return res.status(201).json({
        success: true,
        message: "Personal information created",
        data: newInfo[0],
      });
    }

    // --------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------

    const id = existing[0].id;

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
        id,
      ]
    );

    const [updatedInfo] =
      await pool.query(
        `SELECT id,
                name,
                role,
                role AS title,
                about,
                email,
                linkedin,
                location,
                phone,
                created_at,
                updated_at
         FROM personal_info WHERE id = ?`,
        [id]
      );

    res.json({
      success: true,
      message: "Personal information updated",
      data: updatedInfo[0],
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  // Auth
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  getDashboardStats,

  // Projects
  getProjects,
  createProject,
  updateProject,
  deleteProject,

  // Education
  createEducation,
  updateEducation,
  deleteEducation,

  // Skills
  createSkill,
  updateSkill,
  deleteSkill,
  updateSkillsByCategory,

  // Certifications
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,

  // Languages
  getLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,

  // Hobbies
  getHobbies,
  createHobby,
  updateHobby,
  deleteHobby,

  // Personal
  getPersonalInfo,
  updatePersonalInfo,

  // Upload
  upload,
  uploadImage,

  // Resume
  uploadResume,
  uploadResumeFile,
  getResumeInfo,
  setActiveResume,
  deleteResume,
};