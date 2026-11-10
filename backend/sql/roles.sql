-- Ejecutar después de schema.sql y seed.sql.
-- La app sigue conectando como postgres. Estos roles valen para conexiones directas.

DROP VIEW IF EXISTS v_profile_permission;
DROP VIEW IF EXISTS v_open_loan;
DROP VIEW IF EXISTS v_payroll_summary;
DROP VIEW IF EXISTS v_employee_directory;

CREATE VIEW v_employee_directory AS
SELECT
  e.employee_id,
  p.first_name,
  p.last_name,
  p.national_id,
  d.name AS department_name,
  pos.name AS position_name,
  pf.name AS pay_frequency_name,
  e.hire_date,
  e.pay_modality,
  e.base_salary
FROM employee e
INNER JOIN person p ON p.person_id = e.person_id
INNER JOIN department d ON d.department_id = e.department_id
INNER JOIN position pos ON pos.position_id = e.position_id
INNER JOIN pay_frequency pf ON pf.pay_frequency_id = e.pay_frequency_id
WHERE e.is_active = TRUE;

CREATE VIEW v_payroll_summary AS
SELECT
  pr.payroll_id,
  pr.start_date,
  pr.end_date,
  pr.pay_date,
  pr.status,
  pr.notes,
  pf.name AS pay_frequency_name
FROM payroll pr
INNER JOIN pay_frequency pf ON pf.pay_frequency_id = pr.pay_frequency_id;

CREATE VIEW v_open_loan AS
SELECT
  l.loan_id,
  l.employee_id,
  p.first_name,
  p.last_name,
  l.total_amount,
  l.remaining_balance,
  l.installment,
  l.start_date,
  l.status
FROM loan l
INNER JOIN employee e ON e.employee_id = l.employee_id
INNER JOIN person p ON p.person_id = e.person_id
WHERE l.status <> 'PAID';

CREATE VIEW v_profile_permission AS
SELECT
  pr.profile_id,
  pr.name AS profile_name,
  o.object_de,
  m.method_id,
  m.method_de,
  pe.permission_id
FROM profile pr
LEFT JOIN permission pe ON pe.profile_id = pr.profile_id
LEFT JOIN method m ON m.method_id = pe.method_id
LEFT JOIN object o ON o.object_id = m.object_id;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'payroll_admin') THEN
    CREATE ROLE payroll_admin;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'payroll_hr') THEN
    CREATE ROLE payroll_hr;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'payroll_employee') THEN
    CREATE ROLE payroll_employee;
  END IF;
END $$;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM payroll_admin, payroll_hr, payroll_employee;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM payroll_admin, payroll_hr, payroll_employee;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO payroll_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO payroll_admin;

GRANT SELECT, INSERT, UPDATE, DELETE ON
  department,
  position,
  person,
  employee,
  concept,
  payroll,
  payroll_entry,
  payroll_detail,
  payment,
  loan,
  pay_frequency
TO payroll_hr;

GRANT SELECT ON
  profile,
  object,
  method,
  permission,
  user_profile
TO payroll_hr;

GRANT USAGE, SELECT ON SEQUENCE
  department_department_id_seq,
  position_position_id_seq,
  person_person_id_seq,
  employee_employee_id_seq,
  concept_concept_id_seq,
  payroll_payroll_id_seq,
  payroll_entry_payroll_entry_id_seq,
  payroll_detail_payroll_detail_id_seq,
  payment_payment_id_seq,
  loan_loan_id_seq,
  pay_frequency_pay_frequency_id_seq
TO payroll_hr;

GRANT SELECT ON
  v_employee_directory,
  v_payroll_summary,
  v_open_loan,
  v_profile_permission
TO payroll_employee;
