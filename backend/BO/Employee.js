const Employee = class {
  constructor(deps) {
    this.db = deps.db;
    this.query = deps.query;
  }

  async listEmployees() {
    const r = await this.db.query(this.query.Employee.listEmployees, []);
    if (r === false) return { msg: 'Error al listar empleados', err: 'error sql' };
    return { msg: 'ok', data: r };
  }

  async findEmployee(id) {
    const r = await this.db.query(this.query.Employee.findEmployee, [id]);
    if (r && r.length > 0) return { msg: 'ok', data: r[0] };
    return { msg: 'Employee no encontrado', err: 'no encontrado' };
  }

  async insertEmployee(personId, hireDate, payModality, baseSalary, payFrequencyId, departmentId, positionId) {
    const r = await this.db.query(this.query.Employee.insertEmployee, [
      personId,
      hireDate,
      payModality,
      baseSalary,
      payFrequencyId,
      departmentId,
      positionId
    ]);
    if (r && r.length > 0) return { msg: 'Empleado creado', data: r[0] };
    return { msg: 'Error al crear empleado', err: 'error sql' };
  }

  async updateEmployee(id, hireDate, payModality, baseSalary, payFrequencyId, departmentId, positionId) {
    const r = await this.db.query(this.query.Employee.updateEmployee, [
      id,
      hireDate,
      payModality,
      baseSalary,
      payFrequencyId,
      departmentId,
      positionId
    ]);
    if (r && r.length > 0) return { msg: 'Empleado actualizado', data: r[0] };
    return { msg: 'Error al actualizar empleado', err: 'error sql' };
  }

  async deleteEmployee(id) {
    const r = await this.db.query(this.query.Employee.deleteEmployee, [id]);
    if (r && r.length > 0) return { msg: 'Empleado desactivado', data: r[0] };
    return { msg: 'Error al eliminar empleado', err: 'error sql' };
  }
};

module.exports = Employee;
