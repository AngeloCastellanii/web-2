const Concept = class {
  constructor(obj) {
    this.obj = obj;
  }

  listConcepts() {
    db.query(query.Concept.listConcepts, []).then((r) => {
      if (r === false) {
        this.obj.res.send(JSON.stringify({ msg: 'Error al listar conceptos', err: 'error sql' }));
        return;
      }
      this.obj.res.send(JSON.stringify({ msg: 'ok', data: r }));
    });
  }

  findConcept(id) {
    db.query(query.Concept.findConcept, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'ok', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Concept no encontrado', err: 'no encontrado' }));
      }
    });
  }

  insertConcept(name, effect, category, isAutomatic, calcType, calcValue) {
    db.query(query.Concept.insertConcept, [
      name,
      effect,
      category,
      isAutomatic === true || isAutomatic === 'true',
      calcType || null,
      calcValue || null
    ]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Concepto creado', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al crear concepto', err: 'error sql' }));
      }
    });
  }

  updateConcept(id, name, effect, category, isAutomatic, calcType, calcValue) {
    db.query(query.Concept.updateConcept, [
      id,
      name,
      effect,
      category,
      isAutomatic === true || isAutomatic === 'true',
      calcType || null,
      calcValue || null
    ]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Concepto actualizado', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al actualizar concepto', err: 'error sql' }));
      }
    });
  }

  deleteConcept(id) {
    db.query(query.Concept.deleteConcept, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Concepto desactivado', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al eliminar concepto', err: 'error sql' }));
      }
    });
  }
};

module.exports = Concept;
