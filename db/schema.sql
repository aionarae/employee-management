-- Create a database called employee_list
DROP DATABASE IF EXISTS employee_list;
CREATE DATABASE employee_list;

-- Connect to the employee_list database
\c employee_list

-- Create a table called department
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

-- Create a table called role
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) 
      REFERENCES department (id)
      ON DELETE SET NULL
);

-- Create a table called employee, with a foreign key reference to role and employee/manager
-- if an employee does not have a manager, the manager_id will be NULL
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id) 
      REFERENCES role (id)
      ON DELETE SET NULL,
    FOREIGN KEY (manager_id) 
      REFERENCES employee (id)
);