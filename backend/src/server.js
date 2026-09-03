const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const { testConnection } = require("./config/database");

const portfolioRoutes = require("./routes/portfolioRoutes");
const adminRoutes = require("./routes/adminRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();


// =========================================
// MIDDLEWARE
// =========================================

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

// Read HTTP-only cookies
app.use(cookieParser());


// =========================================
// ROOT ROUTE
// =========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Chandani Portfolio API is running"
  });
});


// =========================================
// PUBLIC PORTFOLIO ROUTES
// =========================================

app.use(
  "/api/portfolio",
  portfolioRoutes
);


// =========================================
// ADMIN ROUTES
// =========================================

app.use(
  "/api/admin",
  adminRoutes
);


// =========================================
// 404 ROUTE
// =========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});


// =========================================
// ERROR HANDLER
// =========================================

app.use(errorHandler);


// =========================================
// START SERVER
// =========================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log("=================================");
      console.log("🚀 Chandani Portfolio Backend");
      console.log(`🌐 http://localhost:${PORT}`);
      console.log("=================================");
    });

  } catch (error) {
    console.error("❌ Server failed to start");
    console.error(error.message);

    process.exit(1);
  }
};

startServer();