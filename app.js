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
  CONCAT(manager.first_name,' ', manager.last_name) AS manager_name
  FROM employee
  LEFT JOIN employee AS manager
  ON manager.id = employee.manager_id
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
  sql = `SELECT manager.id, manager.first_name, manager.last_name,
        CONCAT(manager.first_name,' ', manager.last_name) AS manager_name,
        employee.first_name, employee.last_name,
        role.job_title AS title,
        role.id
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN employee AS manager 
        WHERE employee.manager_id = manager.id;`
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    }
    console.table(rows);
  })
  appStart();
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
    })
  appStart();
};

const addRole = () => {
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
    });
  appStart();
};

const addEmployee = () => {
  db.query(`SELECT id, job_title FROM role;
            SELECT id, first_name, last_name FROM employee AS manager;
          `, (err, rows) => {
    if (err) {
      console.log(err)
    }
    let rolesList = rows[0];
    let rolesChoices = rolesList.map(role => {
      return `${role.id}) ${role.job_title}`
    });

    let managerList = rows[1];
    let managerChoices = managerList.map(manager => {
      return `${manager.id}) ${manager.first_name} ${manager.last_name}`
    })

    inquirer.prompt(
      [
        {
          type: 'input',
          name: 'first_name',
          message: 'New Employee First Name: '
        },
        {
          type: 'input',
          name: 'last_name',
          message: 'Last Name: '
        },
        {
          type: 'list',
          name: 'job_title',
          message: 'What is their job title?',
          choices: rolesChoices,
          when: 'employee_name'
        },
        {
          type: 'list',
          name: 'manager',
          message: 'Who is their manager?',
          choices: managerChoices,
          when: 'department'
        }
      ]
    )
      .then(answer => {
        let roleArr = answer.job_title.split(')');
        let roleId = roleArr[0];
        let mgrArr = answer.manager.split(')');
        let mgrId = mgrArr[0];

        const employee = {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: roleId,
          manager_id: mgrId
        }
        console.log(answer);
        let params = [employee.first_name, employee.last_name, employee.role_id, employee.manager_id];
        console.log(params);
        sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
          VALUES (?, ?, ?, ?)`
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err)
          }
          getAllEmployees();
        })
        appStart();
      })
  })
};

const removeEmployee = () => {
  db.query(`SELECT id, first_name, last_name FROM employee`, (err, rows) => {
    if (err) {
      console.log(err);
    }
    let employeeList = rows;
    let employeeChoices = employeeList.map(employee => {
      return `${employee.id}) ${employee.first_name} ${employee.last_name}`
    })
    inquirer.prompt(
      [
        {
          type: 'list',
          name: 'empToBeRemoved',
          message: 'Which employee needs to be removed?',
          choices: employeeChoices
        }
      ]
    )
      .then(answer => {
        let empArr = answer.empToBeRemoved.split(')');
        let empId = empArr[0];

        const employee = {
          first_name: answer.first_name,
          last_name: answer.last_name,
          id: empId
        }

        const sql = `DELETE FROM employee WHERE id = ?`;
        const params = [employee.id]
        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err)
          }
          else {
            console.log({
              message: 'Employee removed',
              changes: result.affectedRows,
              id: params.id
            })
          }
        })
        appStart();
      })
  })
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
        choices: ['View All Employees', 'View Employees by Department', 'View Employees by Manager', 'Add an Employee', 'Remove Employee', 'View All Departments', 'View All Roles', 'Add a Department', 'Add a Role'],
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

        case 'View Employees by Manager':
          getEmployeesByMgr();
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
          addRole();
          break;

        case 'Add an Employee':
          addEmployee();
          break;

        case 'Remove Employee':
          removeEmployee();
          break;
      }
    })
};

appStart();
