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

const poolConfig = {
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
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = mysql.createPool(poolConfig);

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("=================================");
    console.log("✅ MySQL Database Connected");
    console.log("=================================");
    console.log(`🌐 Host: ${process.env.DB_HOST || "localhost"}`);
    console.log(`🔌 Port: ${process.env.DB_PORT || 3306}`);
    console.log(`📦 Database: ${process.env.DB_NAME || "portfolio"}`);
    console.log(`👤 User: ${process.env.DB_USER || "root"}`);
    console.log(`🔐 SSL: ${process.env.DB_SSL === "true" ? "Enabled" : "Disabled"}`);
    console.log("=================================");

    connection.release();
  } catch (error) {
    console.error("=================================");
    console.error("❌ Aiven MySQL Connection Failed");
    console.error("=================================");
    console.error("Error:", error.message);
    console.error("=================================");

    process.exit(1);
  }
};

module.exports = {
  pool,
  testConnection,
};