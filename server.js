const inquirer = require('inquirer');

// Choices:
// view all departments, 
// view all roles, 
// view all employees, 
// add a department, 
// add a role, 
// add an employee, 
// and update an employee role
let choices;

inquirer
  .prompt(
    [
      {
        type: 'list',
        name: 'choices',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
      }
    ]
  )
  .then((answers) => 
    {
      let choices = answers.choices
      if (choices === 'View all departments') { 
        console.log('View all departments')
      } else if (choices === 'View all roles') {
        console.log('View all roles')
      } else if (choices === 'View all employees') {
        console.log('View all employees')
      } else if (choices === 'Add a department') {
        console.log('Add a department')
      } else if (choices === 'Add a role') {
        console.log('Add a role')
      } else if (choices === 'Add an employee') {
        console.log('Add an employee')
      } else if (choices === 'Update an employee role') {
        console.log('Update an employee role')
      }
    }
  )
  .catch((error) => {
    console.log(error)
  })

// View all departments
// Returns department name and id

// View all roles
// return job title, role id, department that role belongs to, salary

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
