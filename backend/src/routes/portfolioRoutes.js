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
// SUBMIT CONTACT FORM MESSAGE
// POST /api/portfolio/contact
// =====================================================

router.post("/contact", async (req, res, next) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;
    if (!email || !message) {
      return res.status(400).json({
        success: false,
        message: "Email and message are required.",
      });
    }

    const fullName = `${firstName || ""} ${lastName || ""}`.trim() || "Visitor";
    console.log("📬 New contact message from:", fullName, `(${email})`);
    console.log("Subject:", subject);
    console.log("Message:", message);

    // If SMTP credentials exist, send via Nodemailer
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const nodemailer = require("nodemailer");
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"${fullName} (Portfolio)" <${process.env.EMAIL_USER}>`,
          replyTo: email,
          to: "kumarichandanipali@gmail.com",
          subject: `[Portfolio Inquiry] ${subject || "Message from " + fullName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #7c3aed; margin-top: 0;">New Message from Portfolio Website</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 100px;">Name:</td><td style="color: #1e293b;">${fullName}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">Email:</td><td style="color: #1e293b;"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; font-weight: bold;">Subject:</td><td style="color: #1e293b;">${subject || "General Inquiry"}</td></tr>
              </table>
              <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #7c3aed;">
                <p style="margin: 0; color: #334155; white-space: pre-line;">${message}</p>
              </div>
              <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">Sent via Chandani Kumari Portfolio Contact Form</p>
            </div>
          `,
        });
        console.log("✅ Email successfully sent via SMTP to kumarichandanipali@gmail.com");
      } catch (mailErr) {
        console.warn("⚠️ SMTP sending failed, relying on client/FormSubmit fallback:", mailErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Thank you! Your message has been sent to Chandani's email.",
    });
  } catch (error) {
    console.error("❌ Error processing contact message:", error);
    next(error);
  }
});

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;