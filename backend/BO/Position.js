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

const Position = class {
  constructor(deps) {
    this.db = deps.db;
    this.query = deps.query;
  }

  async listPositions() {
    const r = await this.db.query(this.query.Position.listPositions, []);
    if (r === false) return { msg: 'Error al listar cargos', err: 'error sql' };
    return { msg: 'ok', data: r };
  }

  async findPosition(id) {
    const r = await this.db.query(this.query.Position.findPosition, [id]);
    if (r === false) return { msg: 'Error al buscar cargo', err: 'error sql' };
    if (!r.length) return { msg: 'Cargo no encontrado', err: 'no encontrado' };
    return { msg: 'ok', data: r[0] };
  }

  async insertPosition(name, description) {
    const err = missing(name, 'nombre');
    if (err) return err;
    const r = await this.db.query(this.query.Position.insertPosition, [name, description || null]);
    if (r === false) return { msg: 'Error al crear cargo', err: 'error sql' };
    if (!r.length) return { msg: 'Cargo no encontrado', err: 'no encontrado' };
    return { msg: 'Cargo creado', data: r[0] };
  }

  async updatePosition(id, name, description) {
    const err = missing(id, 'id') || missing(name, 'nombre');
    if (err) return err;
    const r = await this.db.query(this.query.Position.updatePosition, [id, name, description || null]);
    if (r === false) return { msg: 'Error al actualizar cargo', err: 'error sql' };
    if (!r.length) return { msg: 'Cargo no encontrado', err: 'no encontrado' };
    return { msg: 'Cargo actualizado', data: r[0] };
  }

  async deletePosition(id) {
    const err = missing(id, 'id');
    if (err) return err;
    const r = await this.db.query(this.query.Position.deletePosition, [id]);
    if (r === false) return { msg: 'Error al eliminar cargo', err: 'error sql' };
    if (!r.length) return { msg: 'Cargo no encontrado', err: 'no encontrado' };
    return { msg: 'Cargo desactivado', data: r[0] };
  }
};

module.exports = Position;
