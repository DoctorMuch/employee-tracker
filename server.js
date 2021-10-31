const express = require('express');

const cTable = require('console.table');
const inquirer = require('inquirer');

const queryRoutes = require('./routes/departmentRoutes');

const db = require('./db/connection');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

app.get('/api/employees', (req, res) => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, 
              role.job_title AS title,
              department.dept_name AS department, 
              role.salary,
              manager.first_name AS manager, manager.last_name AS name
              FROM employee
              JOIN manager ON manager.id = employee.manager_id
              JOIN role ON employee.role_id = role.id
              JOIN department ON department.id = role.department_id`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.log({ rows });
    // res.json({
    //   message: 'success',
    //   data: rows
    // });
  })
  .then(dbStaffData => console.table(dbStaffData));
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

app.delete('/api/employees/:id', (req, res) => {
  const sql = `DELETE FROM employee WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if(err){
      res.status(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Employee not found!'
      });
    } else {
      res.json({
        message: 'Employee has been removed.',
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

app.post('/api/employees', (req, res) => ({ body }, res) => {
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
              VALUES (?,?,?,?)`;
  const params = [body.first_name, body.last_name, body.role_id, body.manager_id];
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
