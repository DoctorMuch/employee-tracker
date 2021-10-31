const mysql = require('mysql2');


const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'd@s@lliver1106',
    database: 'employee_roster',
    multipleStatements: true
  },
  console.log('Connected to employee roster database.')
);

module.exports = db;