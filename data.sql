\c biztime

DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS industries CASCADE;
DROP TABLE IF EXISTS industry_companies CASCADE;


CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries(
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL,
  industry TEXT NOT NULL
);

CREATE TABLE industry_companies(
  industry_id INTEGER NOT NULL REFERENCES industries,
  company_code TEXT NOT NULL REFERENCES companies,
  PRIMARY KEY(industry_id, company_code)


);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries (code,industry) VALUES 
('acct', 'Accounting'),
('devlp', 'Developing'),
('comp', 'Computer');

INSERT INTO industry_companies VALUES
  (2, 'apple'),
  (3, 'ibm');
