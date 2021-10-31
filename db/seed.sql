INSERT INTO department (dept_name)
  VALUES 
  ('Research & Development'),
  ('Quality Assurance'),
  ('Marketing'),
  ('Human Resources'),
  ('Sales')
  ;

INSERT INTO role (job_title, salary, department_id)
VALUES 
  ('Lead Researcher', 140000, 1),
  ('Senior Researcher', 125000, 1),
  ('Product Developer', 110000, 1),
  ('Product Test Coordinator', 80000, 2),
  ('Communications Director', 80000, 3),
  ('Administrative Assistant', 40000, 4),
  ('Recruiter', 75000, 4),
  ('Assistant Sales Representative', 35000, 5),
  ('Regional Sales Manager', 70000, 5)
  ;

INSERT INTO manager (first_name, last_name, department_id, role_id)
VALUES 
  ('Amanda', 'Huggins', 2, 3),
  ('Turnip', 'Green', 4, 7),
  ('Carrot', 'Top', 5, 2)
  ;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Rutabaga', 'Jones', 2, 1),
  ('Lenny', 'Coco', 1, 1),
  ('Judge', 'Reinhold', 4, 3)
  ;
