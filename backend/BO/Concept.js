const Concept = class {
  constructor(obj) {
    this.obj = obj;
  }

  listConcepts() {
    db.query(query.Concept.listConcepts, []).then((r) => {
      if (r === false) {
        this.obj.res.send(JSON.stringify({ msg: 'Error listing concepts', err: 'sql error' }));
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
        this.obj.res.send(JSON.stringify({ msg: 'Concept not found', err: 'not found' }));
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
        this.obj.res.send(JSON.stringify({ msg: 'Concept created', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error creating concept', err: 'sql error' }));
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
        this.obj.res.send(JSON.stringify({ msg: 'Concept updated', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error updating concept', err: 'sql error' }));
      }
    });
  }

  deleteConcept(id) {
    db.query(query.Concept.deleteConcept, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Concept deactivated', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error deleting concept', err: 'sql error' }));
      }
    });
  }
};

module.exports = Concept;
