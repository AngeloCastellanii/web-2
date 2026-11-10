function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (String(value).trim() === '') return true;
  return false;
}

function missing(value, label) {
  if (isEmpty(value) && value !== 0 && value !== false) {
    return { msg: `El campo ${label} es obligatorio`, err: 'validation' };
  }
  return null;
}

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
    const err = missing(name, 'nombre');
    if (err) return err;
    const r = await this.db.query(this.query.Department.insertDepartment, [name, description || null]);
    if (r === false) return { msg: 'Error al crear departamento', err: 'error sql' };
    if (!r.length) return { msg: 'Departamento no encontrado', err: 'no encontrado' };
    return { msg: 'Departamento creado', data: r[0] };
  }

  async updateDepartment(id, name, description) {
    const err = missing(id, 'id') || missing(name, 'nombre');
    if (err) return err;
    const r = await this.db.query(this.query.Department.updateDepartment, [id, name, description || null]);
    if (r === false) return { msg: 'Error al actualizar departamento', err: 'error sql' };
    if (!r.length) return { msg: 'Departamento no encontrado', err: 'no encontrado' };
    return { msg: 'Departamento actualizado', data: r[0] };
  }

  async deleteDepartment(id) {
    const err = missing(id, 'id');
    if (err) return err;
    const r = await this.db.query(this.query.Department.deleteDepartment, [id]);
    if (r === false) return { msg: 'Error al eliminar departamento', err: 'error sql' };
    if (!r.length) return { msg: 'Departamento no encontrado', err: 'no encontrado' };
    return { msg: 'Departamento desactivado', data: r[0] };
  }
};

module.exports = Department;
