const Department = class {
  constructor(deps) {
    this.db = deps.db;
    this.query = deps.query;
  }

  async listDepartments() {
    const r = await this.db.query(this.query.Department.listDepartments, []);
    if (r === false) return { msg: 'Error al listar departamentos', err: 'error sql' };
    return { msg: 'ok', data: r };
  }

  async findDepartment(id) {
    const r = await this.db.query(this.query.Department.findDepartment, [id]);
    if (r === false) return { msg: 'Error al buscar departamento', err: 'error sql' };
    if (!r.length) return { msg: 'Departamento no encontrado', err: 'no encontrado' };
    return { msg: 'ok', data: r[0] };
  }

  async insertDepartment(name, description) {
    const r = await this.db.query(this.query.Department.insertDepartment, [name, description || null]);
    if (r === false) return { msg: 'Error al crear departamento', err: 'error sql' };
    if (!r.length) return { msg: 'Departamento no encontrado', err: 'no encontrado' };
    return { msg: 'Departamento creado', data: r[0] };
  }

  async updateDepartment(id, name, description) {
    const r = await this.db.query(this.query.Department.updateDepartment, [id, name, description || null]);
    if (r === false) return { msg: 'Error al actualizar departamento', err: 'error sql' };
    if (!r.length) return { msg: 'Departamento no encontrado', err: 'no encontrado' };
    return { msg: 'Departamento actualizado', data: r[0] };
  }

  async deleteDepartment(id) {
    const r = await this.db.query(this.query.Department.deleteDepartment, [id]);
    if (r === false) return { msg: 'Error al eliminar departamento', err: 'error sql' };
    if (!r.length) return { msg: 'Departamento no encontrado', err: 'no encontrado' };
    return { msg: 'Departamento desactivado', data: r[0] };
  }
};

module.exports = Department;
