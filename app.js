const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

console.log(
  `Welcome to your new Employee Roster Manager!`);

function appStart() {
  let sql;
  return inquirer.prompt(
    [
      {
        type: 'list',
        name: 'start',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role'] 
      },
        // {
        //   type: 'input',
        //   name: 'employee-add',
        //   message: "What is the employee's first name? "
        // }
    ]
  )
  .then(answer => {
    switch (answer.start) {
      case 'View All Departments': 
        sql = `SELECT department.id, dept_name AS department
              FROM department`;
        db.query(sql, (err, rows) => {
          if(err) {
            console.log(err);
          }
          console.table(rows);
          appStart();
        });
        break;
        
      case 'View All Roles':
        sql = `SELECT job_title, role.id, dept_name AS department, salary
              FROM role
              LEFT JOIN department ON department.id = role.department_id`;
              db.query(sql, (err, rows) => {
                if(err) {
                  console.log(err);
                }
                console.table(rows);
                appStart();
              });
              break;
                
        case 'View All Employees':
          sql = `SELECT employee.id, employee.first_name, employee.last_name, 
                role.job_title AS title,
                department.dept_name AS department, 
                role.salary,
                manager.first_name AS manager, manager.last_name AS name
                FROM employee
                LEFT JOIN manager ON manager.id = employee.manager_id
                JOIN role ON employee.role_id = role.id
                JOIN department ON department.id = role.department_id`;
                db.query(sql, (err, rows) => {
                  if(err) {
                    console.log(err);
                  }
                  console.table(rows);
                  appStart();
                });
                break;
            
        case 'Add Department':
          sql = `INSERT INTO department (dept_name)
                VALUES (?)`;
                db.query(sql, (err, rows) => {
                  if(err) {
                    console.log(err);
                  }
                  console.table(rows);
                  appStart();
                })
    }
  })
};

appStart();
