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

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),

  // Aiven MySQL requires SSL
  ssl: {
    rejectUnauthorized: false,
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("=================================");
    console.log("✅ Aiven MySQL Database Connected");
    console.log("=================================");
    console.log(`🌐 Host: ${process.env.DB_HOST}`);
    console.log(`🔌 Port: ${process.env.DB_PORT}`);
    console.log(`📦 Database: ${process.env.DB_NAME}`);
    console.log(`👤 User: ${process.env.DB_USER}`);
    console.log("🔐 SSL: Enabled");
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