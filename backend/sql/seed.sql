-- Seed data for Payroll MVP

-- Profiles
INSERT INTO profile (name, description) VALUES
  ('Admin', 'Full system access'),
  ('HR', 'Human resources payroll management'),
  ('Employee', 'Read-only employee access');

-- Admin person + user (password: admin123 — plain for course-style auth)
INSERT INTO person (first_name, last_name, national_id, birth_date)
VALUES ('System', 'Admin', 'V00000000', '1990-01-01');

INSERT INTO "user" (person_id, email, password_hash, is_active)
VALUES (1, 'admin@payroll.local', 'admin123', TRUE);

INSERT INTO user_profile (user_id, profile_id) VALUES (1, 1);

-- Catalogs
INSERT INTO pay_frequency (name, description) VALUES
  ('WEEKLY', 'Weekly payments'),
  ('BIWEEKLY', 'Biweekly payments'),
  ('MONTHLY', 'Monthly payments');

INSERT INTO department (name, description) VALUES
  ('Human Resources', 'HR department'),
  ('Finance', 'Finance and accounting'),
  ('Operations', 'Operations department');

INSERT INTO position (name, description) VALUES
  ('Analyst', 'Business analyst'),
  ('Manager', 'Department manager'),
  ('Clerk', 'Administrative clerk');

INSERT INTO concept (name, effect, category, is_automatic, calc_type, calc_value) VALUES
  ('Base Salary', 'CREDIT', 'BASE_SALARY', TRUE, 'FIXED_AMOUNT', NULL),
  ('Overtime', 'CREDIT', 'OVERTIME', FALSE, 'MANUAL', NULL),
  ('Bonus', 'CREDIT', 'BONUS', FALSE, 'FIXED_AMOUNT', NULL),
  ('Legal Deduction SSO', 'DEBIT', 'LEGAL_DEDUCTION', TRUE, 'PERCENT_SALARY', 0.0400),
  ('Optional Deduction', 'DEBIT', 'OPTIONAL', FALSE, 'FIXED_AMOUNT', NULL),
  ('Loan Installment', 'DEBIT', 'LOAN', TRUE, 'FIXED_AMOUNT', NULL);

-- Security objects
INSERT INTO object (object_de) VALUES
  ('Department'),
  ('Position'),
  ('PayFrequency'),
  ('Person'),
  ('Employee'),
  ('Concept'),
  ('Payroll'),
  ('Loan');

-- Helper: insert methods for an object by name
-- Department
INSERT INTO method (object_id, method_de)
SELECT object_id, m FROM object, (VALUES
  ('listDepartments'), ('findDepartment'), ('insertDepartment'), ('updateDepartment'), ('deleteDepartment')
) AS t(m) WHERE object_de = 'Department';

INSERT INTO method (object_id, method_de)
SELECT object_id, m FROM object, (VALUES
  ('listPositions'), ('findPosition'), ('insertPosition'), ('updatePosition'), ('deletePosition')
) AS t(m) WHERE object_de = 'Position';

INSERT INTO method (object_id, method_de)
SELECT object_id, m FROM object, (VALUES
  ('listPayFrequencies'), ('findPayFrequency')
) AS t(m) WHERE object_de = 'PayFrequency';

INSERT INTO method (object_id, method_de)
SELECT object_id, m FROM object, (VALUES
  ('listPersons'), ('findPerson'), ('insertPerson'), ('updatePerson'), ('deletePerson')
) AS t(m) WHERE object_de = 'Person';

INSERT INTO method (object_id, method_de)
SELECT object_id, m FROM object, (VALUES
  ('listEmployees'), ('findEmployee'), ('insertEmployee'), ('updateEmployee'), ('deleteEmployee')
) AS t(m) WHERE object_de = 'Employee';

INSERT INTO method (object_id, method_de)
SELECT object_id, m FROM object, (VALUES
  ('listConcepts'), ('findConcept'), ('insertConcept'), ('updateConcept'), ('deleteConcept')
) AS t(m) WHERE object_de = 'Concept';

INSERT INTO method (object_id, method_de)
SELECT object_id, m FROM object, (VALUES
  ('listPayrolls'), ('findPayroll'), ('insertPayroll'), ('updatePayroll'), ('deletePayroll')
) AS t(m) WHERE object_de = 'Payroll';

INSERT INTO method (object_id, method_de)
SELECT object_id, m FROM object, (VALUES
  ('listLoans'), ('findLoan'), ('insertLoan'), ('updateLoan'), ('deleteLoan')
) AS t(m) WHERE object_de = 'Loan';

-- Admin gets all permissions
INSERT INTO permission (profile_id, method_id)
SELECT 1, method_id FROM method WHERE method_atx = TRUE;

-- HR gets most CRUD except security-related (all payroll BOs)
INSERT INTO permission (profile_id, method_id)
SELECT 2, method_id FROM method WHERE method_atx = TRUE
ON CONFLICT DO NOTHING;
