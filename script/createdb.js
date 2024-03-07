const mysql = require("mysql2/promise");

// MySQL Connection Configuration
const connectionConfig = {
  host: "db",
  // host: "localhost",
  user: "root",
  // password: "jupiterplanet12",
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: null,
};

// Function to create a database
const createDatabase = async (databaseName) => {
  try {
    // Create a connection to MySQL server
    const connection = await mysql.createConnection({
      ...connectionConfig,
      database: null,
    });

    // Check if the database already exists
    const [existingDatabases] = await connection.query(
      "SHOW DATABASES LIKE ?",
      [databaseName]
    );
    if (existingDatabases.length === 0) {
      // Create the database (if it doesn't exist)
      await connection.query(`CREATE DATABASE ${databaseName}`);
      console.log(`Database '${databaseName}' created successfully`);
    } else {
      console.log(`Database '${databaseName}' already exists`);
    }

    await connection.end();
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// Function to create a table
const createTable = async (databaseName, tableName) => {
  try {
    // Create a connection to MySQL server
    const connection = await mysql.createConnection({
      ...connectionConfig,
      database: databaseName,
    });

    // Check if the table already exists
    const [existingTables] = await connection.query("SHOW TABLES LIKE ?", [
      tableName,
    ]);
    if (existingTables.length === 0) {
      // Switch to the specified database
      await connection.changeUser({ database: databaseName });

      // Create the table
      const createTableQuery = `
        CREATE TABLE ${tableName} (
          user_id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50),
          email VARCHAR(100),
          birthdate DATE
        )
      `;
      await connection.query(createTableQuery);
      console.log(`Table '${tableName}' created successfully`);
    } else {
      console.log(`Table '${tableName}' already exists`);
    }

    await connection.end();
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// Run the functions
(async () => {
  await createDatabase("docker");
  await createTable("docker", "users");
})();
