const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config();

const { testConnection } = require("./config/database");

const portfolioRoutes = require("./routes/portfolioRoutes");
const adminRoutes = require("./routes/adminRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

// =====================================================
// CONFIGURATION
// =====================================================

const PORT = process.env.PORT || 5000;

// =====================================================
// MIDDLEWARE
// =====================================================

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin (e.g. Postman, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Always allow any localhost / 127.0.0.1 port
      if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      // Allow vercel / render / custom domains
      if (
        allowedOrigins.includes(origin) ||
        /^https:\/\/.*(\.vercel\.app|\.onrender\.com)$/.test(origin)
      ) {
        return callback(null, true);
      }

      // Safely allow the requesting origin
      return callback(null, true);
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// =====================================================
// COOKIE PARSER
// =====================================================

app.use(cookieParser());

// =====================================================
// STATIC UPLOADS
// =====================================================

// Uploaded certification images/PDF files
// will be accessible through:
// http://localhost:5000/uploads/certifications/filename

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);

// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Chandani Portfolio API is running",
    version: "1.0.0",
    endpoints: {
      portfolio: "/api/portfolio",
      admin: "/api/admin",
    },
  });
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", async (req, res) => {
  try {
    await testConnection();

    res.status(200).json({
      success: true,
      message: "API and database are healthy",
      server: "running",
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Database connection failed",
      server: "running",
      database: "disconnected",
    });
  }
});

// =====================================================
// PUBLIC PORTFOLIO ROUTES
// =====================================================
//
// GET /api/portfolio
// GET /api/portfolio/projects
// GET /api/portfolio/education
// GET /api/portfolio/skills
// GET /api/portfolio/certifications
// GET /api/portfolio/languages
// GET /api/portfolio/hobbies
// GET /api/portfolio/personal
//

app.use(
  "/api/portfolio",
  portfolioRoutes
);

// =====================================================
// ADMIN ROUTES
// =====================================================
//
// POST   /api/admin/register
// POST   /api/admin/login
// POST   /api/admin/logout
// GET    /api/admin/me
//
// Projects
// POST   /api/admin/projects
// PUT    /api/admin/projects/:id
// DELETE /api/admin/projects/:id
//
// Education
// POST   /api/admin/education
// PUT    /api/admin/education/:id
// DELETE /api/admin/education/:id
//
// Skills
// POST   /api/admin/skills
// PUT    /api/admin/skills/:id
// DELETE /api/admin/skills/:id
//
// Certifications
// GET    /api/admin/certifications
// POST   /api/admin/certifications
// PUT    /api/admin/certifications/:id
// DELETE /api/admin/certifications/:id
//
// Languages
// GET    /api/admin/languages
// POST   /api/admin/languages
// PUT    /api/admin/languages/:id
// DELETE /api/admin/languages/:id
//
// Hobbies
// GET    /api/admin/hobbies
// POST   /api/admin/hobbies
// PUT    /api/admin/hobbies/:id
// DELETE /api/admin/hobbies/:id
//
// Personal
// GET    /api/admin/personal
// PUT    /api/admin/personal
//
// Upload
// POST   /api/admin/upload
//

app.use(
  "/api/admin",
  adminRoutes
);

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(errorHandler);

// =====================================================
// START SERVER
// =====================================================

const startServer = async () => {
  try {
    // Check MySQL connection first
    await testConnection();

    app.listen(PORT, () => {
      console.log("");
      console.log("========================================");
      console.log("🚀 Chandani Portfolio Backend");
      console.log("========================================");
      console.log(`🌐 Server: http://localhost:${PORT}`);
      console.log(
        `📁 Uploads: http://localhost:${PORT}/uploads`
      );
      console.log(
        `💼 Portfolio: http://localhost:${PORT}/api/portfolio`
      );
      console.log(
        `🔐 Admin: http://localhost:${PORT}/api/admin`
      );
      console.log(
        `❤️ Health: http://localhost:${PORT}/api/health`
      );
      console.log("========================================");
      console.log("✅ Server started successfully");
      console.log("");
    });
  } catch (error) {
    console.error("");
    console.error("========================================");
    console.error("❌ SERVER STARTUP FAILED");
    console.error("========================================");
    console.error(error.message);
    console.error("========================================");
    console.error("");

    process.exit(1);
  }
};

// =====================================================
// HANDLE UNEXPECTED ERRORS
// =====================================================

process.on("unhandledRejection", (error) => {
  console.error(
    "❌ Unhandled Promise Rejection:",
    error
  );
});

process.on("uncaughtException", (error) => {
  console.error(
    "❌ Uncaught Exception:",
    error
  );

  process.exit(1);
});

// =====================================================
// START APPLICATION
// =====================================================

startServer();

module.exports = app;