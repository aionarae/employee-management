const express = require('express');
const inquirer = require('inquirer');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to the database
const pool = new Pool(
  {
    host: 'localhost',
    database: 'employee_list', 
    user: 'postgres',
    password: '',
  }, 
  console.log('Connected to the employee_list database')
);

pool.connect();

let choices;

//  Shows all the choices for the user to select from
const choicesList = [
  'View all departments',
  'View all roles',
  'View all employees',
  'Add a department',
  'Add a role',
  'Add an employee',
  'Update an employee role'
];

function executeQuery(sql) {
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, res) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        console.table(res.rows);
        resolve(res);
      }
    });
  });
}

function promptUser() {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'choices',
      message: 'What would you like to do?',
      choices: choicesList
    }
  ]);
}

function handleChoice(choice) {
  let query;
  switch (choice) {
    // View all departments showing id and name
    case 'View all departments':
      query = 'SELECT id, name FROM department';
      break;
    // View all roles showing id, title, salary, and department_id
    case 'View all roles':
      query = 'SELECT id, title, salary, department_id FROM role';
      break;
    // View all employees showing employee ids, first names, last names, job titles, departments, salaries, and manager
    case 'View all employees':
      query = `SELECT
        employee.id AS employee_id,
        employee.first_name AS first_name,
        employee.last_name AS last_name,
        role.title AS job_title,
        department.name AS department,
        role.salary AS salary,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
        FROM 
          employee
        LEFT JOIN 
          role ON employee.role_id = role.id
        LEFT JOIN 
          department ON role.department_id = department.id
        LEFT JOIN
          employee AS manager ON employee.manager_id = manager.id`;
      break;
    // Add a department
    case 'Add a department':
      inquirer.prompt([
        {
          type: 'input',
          name: 'departmentName',
          message: 'Enter the name of the department'
        }
      ])
      .then((answer) => {
        // Use answer.departmentName here
        console.log(answer.departmentName);
        query = 'INSERT INTO department (name) VALUES ($1)';
        pool.query(query, [answer.departmentName], (err, res) => {
          if (err) {
            console.error(err.message);
            return;
          } 
          console.log('Department added');
          executeQuery('SELECT * FROM department');
        });
      });
      return;
    // add a role
    // prompt: the name, salary, and department for the role 
    // that role is added to the database
    case 'Add a role':
      inquirer.prompt([ 
        {
          type: 'input', 
          name: 'roleName', 
          message: 'Enter the name of the role'},
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary for the role'
        },
        {
          type: 'input',
          name: 'departmentId',
          message: 'Enter the department id for the role'
        }
        ]).then((answer) => {
          console.log(answer.roleName);
          console.log(answer.salary);
          console.log(answer.departmentId);
          query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
          pool.query(query, [answer.roleName, answer.salary, answer.departmentId], (err, res) => {
            if (err) {
              console.error(err.message);
              return;
            } else if (res.rowCount === 0) {
              console.log('Department not found');
              return;
            } else {
            console.log('Role added');
            executeQuery('SELECT * FROM role');
            }
        })
      });
      return;
    // add an employee
    // prompt: Temployee’s first name, last name, role, and manager, 
    // add employee to the database
    case 'Add an employee':
      inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: 'Enter the employee\'s first name'
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'Enter the employee\'s last name'
        },
        {
          type: 'input',
          name: 'roleId',
          message: 'Enter the role id for the employee'
        },
        {
          type: 'input',
          name: 'managerId',
          message: 'Enter the manager id for the employee'
        }
      ]).then((answer) => {
        console.log(answer.firstName);
        console.log(answer.lastName);
        console.log(answer.roleId);
        console.log(answer.managerId);
        // if manager id can't be found in the database, console.log('Manager not found')
        managerId = answer.managerId;
        managerQuery = 'SELECT * FROM employee WHERE id = $1';
        pool.query(managerQuery, [managerId], (err, res) => {
          if (err) {
            console.error(err.message);
            return;
          } else if (res.rowCount === 0) {
            console.log('Manager not found');
            return;
          }
        });
        query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
        pool.query(query, [answer.firstName, answer.lastName, answer.roleId, answer.managerId], (err, res) => {

        
          if (err) {
            console.error(err.message);
            return;
          } else if (res.rowCount === 0) {
            console.log('Role not found');
            return;
          } else {
          console.log('Employee added');
          executeQuery('SELECT * FROM employee');
          }
        });
      }, (error) => console.log(error));
      return;
      // update an employee role
      // select employee to update and their new role 
      // and this information is updated in the database
    case 'Update an employee role':
      inquirer.prompt([
        {
          type: 'input',
          name: 'employeeId',
          message: 'Enter the id of the employee to update'
        },
        {
          type: 'input',
          name: 'newRoleId',
          message: 'Enter the new role id for the employee'
        }
      ]).then((answer) => {
        console.log(answer.employeeId);
        console.log(answer.newRoleId);
        query = 'UPDATE employee SET role_id = $1 WHERE id = $2';
        pool.query(query, [answer.newRoleId, answer.employeeId], (err, res) => {
          if (err) {
            console.error(err.message);
            return;
          } else if (res.rowCount === 0) {
            console.log('Employee not found');
            return;
          } else {
          console.log('Employee role updated');
          executeQuery('SELECT * FROM employee');
          }
        });
      });
      return;

    default:
      console.log('Invalid choice');
      return;
  }
  executeQuery(query)
    .then(() => promptUser())
    .then((answers) => handleChoice(answers.choices))
    .catch((error) => console.log(error));
}

promptUser()
  .then((answers) => handleChoice(answers.choices))
  .catch((error) => console.log(error));



// add a department
// prompt: enter the name of the department 
// add that department to the database



// Bonus:
// Update employee managers.
// View employees by manager.
//View employees by department.
//Delete departments, roles, and employees.
//View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.

