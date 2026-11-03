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
    if (r && r.length > 0) return { msg: 'ok', data: r[0] };
    return { msg: 'Concept no encontrado', err: 'no encontrado' };
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
    if (r && r.length > 0) return { msg: 'Concepto creado', data: r[0] };
    return { msg: 'Error al crear concepto', err: 'error sql' };
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
    if (r && r.length > 0) return { msg: 'Concepto actualizado', data: r[0] };
    return { msg: 'Error al actualizar concepto', err: 'error sql' };
  }

  async deleteConcept(id) {
    const r = await this.db.query(this.query.Concept.deleteConcept, [id]);
    if (r && r.length > 0) return { msg: 'Concepto desactivado', data: r[0] };
    return { msg: 'Error al eliminar concepto', err: 'error sql' };
  }
};

module.exports = Concept;
