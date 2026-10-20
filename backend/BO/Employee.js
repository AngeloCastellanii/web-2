const Employee = class {
  constructor(obj) {
    this.obj = obj;
  }

  listEmployees() {
    db.query(query.Employee.listEmployees, []).then((r) => {
      if (r === false) {
        this.obj.res.send(JSON.stringify({ msg: 'Error listing employees', err: 'sql error' }));
        return;
      }
      this.obj.res.send(JSON.stringify({ msg: 'ok', data: r }));
    });
  }

  findEmployee(id) {
    db.query(query.Employee.findEmployee, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'ok', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Employee not found', err: 'not found' }));
      }
    });
  }

  insertEmployee(personId, hireDate, payModality, baseSalary, payFrequencyId, departmentId, positionId) {
    db.query(query.Employee.insertEmployee, [
      personId,
      hireDate,
      payModality,
      baseSalary,
      payFrequencyId,
      departmentId,
      positionId
    ]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Employee created', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error creating employee', err: 'sql error' }));
      }
    });
  }

  updateEmployee(id, hireDate, payModality, baseSalary, payFrequencyId, departmentId, positionId) {
    db.query(query.Employee.updateEmployee, [
      id,
      hireDate,
      payModality,
      baseSalary,
      payFrequencyId,
      departmentId,
      positionId
    ]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Employee updated', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error updating employee', err: 'sql error' }));
      }
    });
  }

  deleteEmployee(id) {
    db.query(query.Employee.deleteEmployee, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Employee deactivated', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error deleting employee', err: 'sql error' }));
      }
    });
  }
};

module.exports = Employee;
