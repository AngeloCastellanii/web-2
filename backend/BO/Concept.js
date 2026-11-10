const Concept = class {
  constructor(deps) {
    this.db = deps.db;
    this.query = deps.query;
  }

  async listConcepts() {
    const r = await this.db.query(this.query.Concept.listConcepts, []);
    if (r === false) return { msg: 'Error al listar conceptos', err: 'error sql' };
    return { msg: 'ok', data: r };
  }

  async findConcept(id) {
    const r = await this.db.query(this.query.Concept.findConcept, [id]);
    if (r === false) return { msg: 'Error al buscar concepto', err: 'error sql' };
    if (!r.length) return { msg: 'Concepto no encontrado', err: 'no encontrado' };
    return { msg: 'ok', data: r[0] };
  }

  async insertConcept(name, effect, category, isAutomatic, calcType, calcValue) {
    const r = await this.db.query(this.query.Concept.insertConcept, [
      name,
      effect,
      category,
      isAutomatic === true || isAutomatic === 'true',
      calcType || null,
      calcValue || null
    ]);
    if (r === false) return { msg: 'Error al crear concepto', err: 'error sql' };
    if (!r.length) return { msg: 'Concepto no encontrado', err: 'no encontrado' };
    return { msg: 'Concepto creado', data: r[0] };
  }

  async updateConcept(id, name, effect, category, isAutomatic, calcType, calcValue) {
    const r = await this.db.query(this.query.Concept.updateConcept, [
      id,
      name,
      effect,
      category,
      isAutomatic === true || isAutomatic === 'true',
      calcType || null,
      calcValue || null
    ]);
    if (r === false) return { msg: 'Error al actualizar concepto', err: 'error sql' };
    if (!r.length) return { msg: 'Concepto no encontrado', err: 'no encontrado' };
    return { msg: 'Concepto actualizado', data: r[0] };
  }

  async deleteConcept(id) {
    const r = await this.db.query(this.query.Concept.deleteConcept, [id]);
    if (r === false) return { msg: 'Error al eliminar concepto', err: 'error sql' };
    if (!r.length) return { msg: 'Concepto no encontrado', err: 'no encontrado' };
    return { msg: 'Concepto desactivado', data: r[0] };
  }
};

module.exports = Concept;
