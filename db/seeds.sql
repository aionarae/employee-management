INSERT INTO department (name) 
VALUES ('Engineering'),
       ('Finance'),
       ('Legal'),
       ('Sales'),
       ('Marketing'),
       ('Human Resources'),
       ('Customer Service'),
       ('Research and Development'),
       ('Quality Assurance'),
       ('Information Technology');

INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 100000, 1),
       ('Accountant', 75000, 2),
       ('Attorney', 120000, 3),
       ('Salesperson', 80000, 4),
       ('Marketing Manager', 110000, 5),
       ('HR Specialist', 70000, 6),
       ('Customer Service Rep', 50000, 7),
       ('Research Scientist', 90000, 8),
       ('QA Tester', 60000, 9),
       ('Systems Admin', 95000, 10);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
       ('Jane', 'Smith', 2, NULL),
       ('Alice', 'Williams', 3, NULL),
       ('Charlie', 'Brown', 4, NULL),
       ('Diana', 'Jones', 5, NULL),
       ('Bob', 'Johnson', 6, NULL),
       ('Eve', 'Davis', 7, NULL),
       ('Frank', 'Thomas', 8, NULL),
       ('Grace', 'Lee', 9, NULL),
       ('Henry', 'Wang', 9, NULL);