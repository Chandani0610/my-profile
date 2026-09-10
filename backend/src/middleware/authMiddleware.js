const { pool } = require("../config/database");

const authMiddleware = async (req, res, next) => {
  try {
    const cookieToken = req.cookies?.admin_session;
    const authHeader = req.headers?.authorization;
    const headerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please sign in."
      });
    }

    const [sessions] = await pool.query(
      `SELECT
          admin_sessions.id,
          admin_sessions.admin_id,
          admin_sessions.expires_at,
          admins.name,
          admins.email
       FROM admin_sessions
       INNER JOIN admins
          ON admin_sessions.admin_id = admins.id
       WHERE admin_sessions.session_token = ?
       AND admin_sessions.expires_at > NOW()`,
      [token]
    );

    if (sessions.length === 0) {
      if (res.clearCookie) {
        res.clearCookie("admin_session");
      }

      return res.status(401).json({
        success: false,
        message: "Session expired or invalid. Please login again."
      });
    }

    req.admin = {
      id: sessions[0].admin_id,
      name: sessions[0].name,
      email: sessions[0].email
    };

    next();

  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;