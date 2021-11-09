const express = require('express');
const router = express.Router();
const db = require('../db/connection.js');

router.get('/employees', (req, res) => {
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
    console.table(rows);
    res.json({data: rows});
    // res.json({
    //   message: 'success',
    //   data: rows
    // });
  })
});

router.delete('/employees/:id', (req, res) => {
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

router.post('/employees', (req, res) => ({ body }, res) => {
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

module.exports = router;