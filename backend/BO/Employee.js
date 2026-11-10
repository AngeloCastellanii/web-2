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
    if (r === false) return { msg: 'Error al buscar empleado', err: 'error sql' };
    if (!r.length) return { msg: 'Empleado no encontrado', err: 'no encontrado' };
    return { msg: 'ok', data: r[0] };
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
    if (r === false) return { msg: 'Error al crear empleado', err: 'error sql' };
    if (!r.length) return { msg: 'Empleado no encontrado', err: 'no encontrado' };
    return { msg: 'Empleado creado', data: r[0] };
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
    if (r === false) return { msg: 'Error al actualizar empleado', err: 'error sql' };
    if (!r.length) return { msg: 'Empleado no encontrado', err: 'no encontrado' };
    return { msg: 'Empleado actualizado', data: r[0] };
  }

  async deleteEmployee(id) {
    const r = await this.db.query(this.query.Employee.deleteEmployee, [id]);
    if (r === false) return { msg: 'Error al eliminar empleado', err: 'error sql' };
    if (!r.length) return { msg: 'Empleado no encontrado', err: 'no encontrado' };
    return { msg: 'Empleado desactivado', data: r[0] };
  }
};

module.exports = Employee;
