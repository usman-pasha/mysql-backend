const mysql = require("mysql2/promise");
// const mysql = require("mysql2");

// MySQL Connection Configuration
const connectionConfig = {
  host: "db",
  //   host: "localhost",
  user: "root",
  password: process.env.MYSQL_ROOT_PASSWORD,
  //   password: "system",
  // database: "docker",
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create a connection pool to MySQL server
const pool = mysql.createPool(connectionConfig);

// Function to create database and table
module.exports.createDatabase = async () => {
  try {
    // Get a connection from the pool to test the connection
    const connection = await pool.getConnection();
    console.log("Connected to MySQL database successfully");
    // Release the connection back to the pool
    connection.release();
  } catch (error) {
    console.error("Error connecting to MySQL:", error.message);
  }
};

// Helper function to execute MySQL queries
module.exports.executeQuery = async (query, values) => {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(query, values);
    return results;
  } finally {
    connection.release();
  }
};
