// const mysql = require("mysql2/promise");
// require("dotenv").config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: Number(process.env.DB_PORT),

//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// const testConnection = async () => {
//   try {
//     const connection = await pool.getConnection();

//     console.log("=================================");
//     console.log("✅ MySQL Database Connected");
//     console.log("=================================");

//     connection.release();
//   } catch (error) {
//     console.error("❌ MySQL Connection Failed");
//     console.error(error.message);

//     process.exit(1);
//   }
// };

// module.exports = {
//   pool,
//   testConnection
// };




const mysql = require("mysql2/promise");
require("dotenv").config();

const primaryConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "portfolio",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (process.env.DB_SSL === "true" || process.env.DB_SSL === true) {
  primaryConfig.ssl = {
    rejectUnauthorized: false,
  };
}

let activePool = mysql.createPool(primaryConfig);

// Resilient pool proxy that always delegates to activePool
const pool = new Proxy({}, {
  get(target, prop) {
    const val = activePool[prop];
    if (typeof val === "function") {
      return val.bind(activePool);
    }
    return val;
  },
});

const ensureSchema = async (connection) => {
  try {
    // Ensure settings table exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS portfolio_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Ensure image column exists in projects table
    try {
      await connection.query(`
        ALTER TABLE projects ADD COLUMN image VARCHAR(255) DEFAULT NULL
      `);
    } catch (err) {
      if (err.code !== "ER_DUP_FIELDNAME") {
        // Table might not exist yet if fresh DB
      }
    }
  } catch (err) {
    console.warn("Schema initialization notice:", err.message);
  }
};

const testConnection = async () => {
  try {
    const connection = await activePool.getConnection();

    console.log("=================================");
    console.log("✅ MySQL Database Connected (Primary)");
    console.log("=================================");
    console.log(`🌐 Host: ${primaryConfig.host}`);
    console.log(`🔌 Port: ${primaryConfig.port}`);
    console.log(`📦 Database: ${primaryConfig.database}`);
    console.log(`👤 User: ${primaryConfig.user}`);
    console.log(`🔐 SSL: ${process.env.DB_SSL === "true" ? "Enabled" : "Disabled"}`);
    console.log("=================================");

    await ensureSchema(connection);
    connection.release();
  } catch (primaryError) {
    console.warn("=================================");
    console.warn("⚠️ Primary MySQL Connection Failed");
    console.warn("=================================");
    console.warn(`Host: ${primaryConfig.host}`);
    console.warn(`Error: ${primaryError.message}`);
    if (primaryError.code === "ENOTFOUND") {
      console.warn("👉 Diagnosis: Hostname cannot be resolved (DNS name does not exist).");
      console.warn("   Your Aiven cloud service may be paused, powered off, or expired in the Aiven Console (https://console.aiven.io).");
    }
    console.warn("=================================");

    // Attempt automatic fallback to local database
    const localHost = process.env.LOCAL_DB_HOST || "localhost";
    console.log(`🔄 Attempting automatic fallback to Local MySQL (${localHost})...`);

    try {
      const fallbackConfig = {
        host: localHost,
        user: process.env.LOCAL_DB_USER || "root",
        password: process.env.LOCAL_DB_PASSWORD || "",
        database: process.env.LOCAL_DB_NAME || "portfolio",
        port: Number(process.env.LOCAL_DB_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      };

      const fallbackPool = mysql.createPool(fallbackConfig);
      const fallbackConnection = await fallbackPool.getConnection();
      activePool = fallbackPool;

      console.log("=================================");
      console.log("✅ Fallback to Local MySQL Connected Successfully");
      console.log("=================================");
      console.log(`🌐 Host: ${fallbackConfig.host}`);
      console.log(`🔌 Port: ${fallbackConfig.port}`);
      console.log(`📦 Database: ${fallbackConfig.database}`);
      console.log("=================================");

      await ensureSchema(fallbackConnection);
      fallbackConnection.release();
    } catch (fallbackError) {
      console.error("=================================");
      console.error("❌ Both Primary and Fallback Database Connections Failed");
      console.error("Fallback Error:", fallbackError.message);
      console.error("=================================");
      process.exit(1);
    }
  }
};

module.exports = {
  pool,
  testConnection,
};