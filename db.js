// db_connection.js
const mysql = require('mysql');
require("dotenv").config();

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,  // Your MySQL host
  user: process.env.DB_USER,  // Your MySQL username
//   password: process.env.DB_PASSWORD,  // Your MySQL password
  password: '',  // Your MySQL password
  database: process.env.DB_NAME  // Your MySQL database name
});

// Check if the connection is successful
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database');
    connection.release(); // Release the connection
  }
});

// Export the pool to be used in other modules
module.exports = pool;
