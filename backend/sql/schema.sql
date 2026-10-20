-- Payroll System schema (PostgreSQL)

DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS payroll_detail CASCADE;
DROP TABLE IF EXISTS payroll_entry CASCADE;
DROP TABLE IF EXISTS payroll CASCADE;
DROP TABLE IF EXISTS loan CASCADE;
DROP TABLE IF EXISTS concept CASCADE;
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS pay_frequency CASCADE;
DROP TABLE IF EXISTS position CASCADE;
DROP TABLE IF EXISTS department CASCADE;
DROP TABLE IF EXISTS permission CASCADE;
DROP TABLE IF EXISTS method CASCADE;
DROP TABLE IF EXISTS object CASCADE;
DROP TABLE IF EXISTS user_profile CASCADE;
DROP TABLE IF EXISTS profile CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS person CASCADE;

-- Identity
CREATE TABLE person (
  person_id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  national_id VARCHAR(20) NOT NULL UNIQUE,
  birth_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "user" (
  user_id SERIAL PRIMARY KEY,
  person_id INT NOT NULL UNIQUE REFERENCES person(person_id),
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE profile (
  profile_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255)
);

CREATE TABLE user_profile (
  user_profile_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES "user"(user_id),
  profile_id INT NOT NULL REFERENCES profile(profile_id),
  UNIQUE (user_id, profile_id)
);

-- Security (course-style)
CREATE TABLE object (
  object_id SERIAL PRIMARY KEY,
  object_de VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE method (
  method_id SERIAL PRIMARY KEY,
  object_id INT NOT NULL REFERENCES object(object_id),
  method_de VARCHAR(100) NOT NULL,
  method_atx BOOLEAN DEFAULT TRUE,
  UNIQUE (object_id, method_de)
);

CREATE TABLE permission (
  permission_id SERIAL PRIMARY KEY,
  profile_id INT NOT NULL REFERENCES profile(profile_id),
  method_id INT NOT NULL REFERENCES method(method_id),
  UNIQUE (profile_id, method_id)
);

-- Organization
CREATE TABLE department (
  department_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE position (
  position_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pay_frequency (
  pay_frequency_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255)
);

CREATE TABLE employee (
  employee_id SERIAL PRIMARY KEY,
  person_id INT NOT NULL UNIQUE REFERENCES person(person_id),
  hire_date DATE NOT NULL,
  pay_modality VARCHAR(20) NOT NULL,
  base_salary DECIMAL(12,2) NOT NULL,
  pay_frequency_id INT NOT NULL REFERENCES pay_frequency(pay_frequency_id),
  department_id INT NOT NULL REFERENCES department(department_id),
  position_id INT NOT NULL REFERENCES position(position_id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payroll
CREATE TABLE concept (
  concept_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  effect VARCHAR(10) NOT NULL,
  category VARCHAR(50) NOT NULL,
  is_automatic BOOLEAN NOT NULL DEFAULT FALSE,
  calc_type VARCHAR(30),
  calc_value DECIMAL(12,4),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payroll (
  payroll_id SERIAL PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  pay_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  pay_frequency_id INT NOT NULL REFERENCES pay_frequency(pay_frequency_id),
  notes VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payroll_entry (
  payroll_entry_id SERIAL PRIMARY KEY,
  payroll_id INT NOT NULL REFERENCES payroll(payroll_id),
  employee_id INT NOT NULL REFERENCES employee(employee_id),
  total_earnings DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total_deductions DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  net_total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (payroll_id, employee_id)
);

CREATE TABLE payroll_detail (
  payroll_detail_id SERIAL PRIMARY KEY,
  payroll_entry_id INT NOT NULL REFERENCES payroll_entry(payroll_entry_id),
  concept_id INT NOT NULL REFERENCES concept(concept_id),
  quantity DECIMAL(12,2) NOT NULL DEFAULT 1.00,
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payment (
  payment_id SERIAL PRIMARY KEY,
  payroll_entry_id INT NOT NULL REFERENCES payroll_entry(payroll_entry_id),
  payment_date DATE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(50),
  notes VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE loan (
  loan_id SERIAL PRIMARY KEY,
  employee_id INT NOT NULL REFERENCES employee(employee_id),
  total_amount DECIMAL(12,2) NOT NULL,
  remaining_balance DECIMAL(12,2) NOT NULL,
  installment DECIMAL(12,2) NOT NULL,
  start_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
