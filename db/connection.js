const mysql = require('mysql2');

require('dotenv').config();

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    multipleStatements: true
  },
  console.log('Connected to employee roster database.')
);


module.exports = db;