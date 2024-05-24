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
    // View all employees showing id, first_name, last_name, role_id, and manager_id
    // including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

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
      console.log('Add a department');
      return;
    case 'Add a role':
      console.log('Add a role');
      return;
    case 'Add an employee':
      console.log('Add an employee');
      return;
    case 'Update an employee role':
      console.log('Update an employee role');
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

// view all employees
// returns table with employee data, 
// including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

// add a department
// prompt: enter the name of the department 
// add that department to the database

// add a role
// prompt: the name, salary, and department for the role 
// that role is added to the database

// add an employee
// prompt: Temployee’s first name, last name, role, and manager, 
// add employee to the database


// update an employee role
// select employee to update and their new role 
// and this information is updated in the database