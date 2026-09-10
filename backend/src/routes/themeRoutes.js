const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");

const ALLOWED_THEMES = ["emerald", "purple", "blue", "rose", "dark", "orange"];

// Normalize legacy or alternative names if sent
const normalizeTheme = (t) => {
  if (!t) return "purple";
  const lower = String(t).toLowerCase().trim();
  if (lower === "green") return "emerald";
  if (lower === "red") return "rose";
  return lower;
};

// GET current theme
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT setting_value FROM portfolio_settings WHERE setting_key = 'theme' LIMIT 1"
    );

    const theme = rows.length > 0 ? rows[0].setting_value : "purple";

    return res.status(200).json({
      success: true,
      theme,
    });
  } catch (error) {
    next(error);
  }
});

// PUT update theme
router.put("/", async (req, res, next) => {
  try {
    const rawTheme = req.body.theme || req.body.currentTheme;
    const theme = normalizeTheme(rawTheme);

    if (!ALLOWED_THEMES.includes(theme)) {
      return res.status(400).json({
        success: false,
        message: `Invalid theme. Allowed themes: ${ALLOWED_THEMES.join(", ")}`,
      });
    }

    await pool.query(
      `INSERT INTO portfolio_settings (setting_key, setting_value)
       VALUES ('theme', ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [theme]
    );

    return res.status(200).json({
      success: true,
      message: "Theme updated successfully",
      theme,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
