const express = require('express');
const { restoreDefaultPrompts } = require('inquirer');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'd@s@lliver1106',
    database: 'employee_roster'
  },
  console.log('Connected to employee roster database.')
);

app.get('/api/departments', (req, res) => {
  const sql = `SELECT * FROM department`;

  db.query(sql, (err, rows) => {
    if(err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

app.get('/api/departments/:id', (req, res) => {
  const sql = `SELECT * FROM department WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, row) => {
    if(err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

app.delete('/api/departments/:id', (req, res) => {
  const sql = `DELETE FROM department WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if(err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Department not found!'
      });
    } else {
      res.json({
        message: 'Department removed', 
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

app.post('/api/departments', ({ body }, res) => {
  const sql = `INSERT INTO department (dept_name)
              VALUES (?)`;
  const params = [body.dept_name];
  db.query(sql, params, (err, result) => {
    if(err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Now listening on ${PORT}, my friend`);
});
