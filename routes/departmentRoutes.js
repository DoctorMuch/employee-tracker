const express = require('express');
const router = express.Router();
const db = require('../db/connection.js');

router.get('/departments', (req, res) => {
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

router.get('/departments/:id', (req, res) => {
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

router.delete('/departments/:id', (req, res) => {
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

router.post('/departments', ({ body }, res) => {
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

module.exports = router;