const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

const getAllDepartments = () => {
  sql = `SELECT department.id, dept_name AS department
              FROM department`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    }
    console.table('\nCompany Departments', rows);
  });
  appStart();
};

const getAllRoles = () => {
  sql = `SELECT job_title, role.id, dept_name AS department, salary
  FROM role
  LEFT JOIN department ON department.id = role.department_id`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    }
    console.table(rows);
  });
  appStart();
};

const getAllEmployees = () => {
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
    if (err) {
      console.log(err);
    }
    console.table(rows);
  });
  appStart();
};

const getEmployeesByDept = () => {
  sql = `SELECT department.dept_name AS department,
        employee.id, employee.first_name, employee.last_name,
        role.job_title AS title
        FROM employee
        JOIN role 
        ON role.id = employee.role_id
        LEFT JOIN department ON department.id = role.department_id`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    }
    console.table(rows);
  })
  appStart();
};

const getEmployeesByMgr = () => {

}

const addDepartment = () => {
  inquirer.prompt(
    [
      {
        type: 'input',
        name: 'add_dept',
        message: 'What is the name of the department that you are adding?'
      }
    ]
  )
    .then(answer => {
      let params = Object.values(answer)[0];
      sql = `INSERT INTO department (dept_name)
        VALUES (?)`;
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log('Something went wrong:', err);
        }
        getAllDepartments()
      });
    }
    )
}

console.log(
  `Welcome to your new Employee Roster Manager!`);

const appStart = () => {
  let sql;
  console.log(
    `
    **************
    `
  );
  inquirer.prompt(
    [
      {
        type: 'list',
        name: 'start',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'View Employees by Department', 'View Employees by Manager', 'View All Departments', 'View All Roles', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role'],
        default: 'View All Departments'
      }
    ]
  )
    .then(answer => {
      switch (answer.start) {
        case 'View All Employees':
          getAllEmployees();
          break;

        case 'View Employees by Department':
          getEmployeesByDept();
          break;

        case 'View All Departments':
          getAllDepartments();
          break;

        case 'View All Roles':
          getAllRoles();
          break;

        case 'Add a Department':
          addDepartment();
          break;

        case 'Add a Role':
          inquirer.prompt(
            [
              {
                type: 'input',
                name: 'add_role',
                message: 'What job title are you adding?'
              },
              {
                type: 'input',
                name: 'salary',
                message: 'What is the salary for this position?'
              },
              {
                type: 'input',
                name: 'department_id',
                message: 'What is the department id for this position?'
              }
            ]
          )
            .then(answer => {
              let params = [Object.values(answer)[0], Object.values(answer)[1], Object.values(answer)[2]];
              console.log(params);
              sql = `INSERT INTO role (job_title, salary, department_id)
                    VALUES (?, ?, ?)`;
              db.query(sql, params, (err, result) => {
                if (err) {
                  console.log('Something is wrong', err)
                }
              })
              getAllRoles();
            })
        case 'Add an Employee':

        case 'Update an Employee Role':
      }
    })
};

appStart();
