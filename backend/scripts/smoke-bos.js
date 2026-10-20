const path = require('path');
const fs = require('fs');

global.config = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8')
);
global.query = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'Querys.json'), 'utf8')
);
global.log = {
  info: () => {},
  error: () => {},
  warn: () => {},
  debug: () => {}
};
global.db = {
  query: async () => []
};

const bos = [
  'Department',
  'Position',
  'PayFrequency',
  'Person',
  'Employee',
  'Concept',
  'Payroll',
  'Loan'
];

let ok = true;
for (const name of bos) {
  try {
    const C = require(path.join(__dirname, '..', 'BO', name));
    const instance = new C({ res: { send: () => {} }, params: [] });
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).filter(
      (m) => m !== 'constructor'
    );
    console.log(`OK ${name}: ${methods.join(', ')}`);
  } catch (e) {
    ok = false;
    console.error(`FAIL ${name}: ${e.message}`);
  }
}

process.exit(ok ? 0 : 1);
