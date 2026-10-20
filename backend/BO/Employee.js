const Employee = class {
  constructor(obj) {
    this.obj = obj;
  }

  listEmployees() {
    db.query(query.Employee.listEmployees, []).then((r) => {
      if (r === false) {
        this.obj.res.send(JSON.stringify({ msg: 'Error al listar empleados', err: 'error sql' }));
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
        this.obj.res.send(JSON.stringify({ msg: 'Employee no encontrado', err: 'no encontrado' }));
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
        this.obj.res.send(JSON.stringify({ msg: 'Empleado creado', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al crear empleado', err: 'error sql' }));
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
        this.obj.res.send(JSON.stringify({ msg: 'Empleado actualizado', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al actualizar empleado', err: 'error sql' }));
      }
    });
  }

  deleteEmployee(id) {
    db.query(query.Employee.deleteEmployee, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Empleado desactivado', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al eliminar empleado', err: 'error sql' }));
      }
    });
  }
};

module.exports = Employee;
