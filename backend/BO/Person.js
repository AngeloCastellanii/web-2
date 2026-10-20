const Person = class {
  constructor(obj) {
    this.obj = obj;
  }

  listPersons() {
    db.query(query.Person.listPersons, []).then((r) => {
      if (r === false) {
        this.obj.res.send(JSON.stringify({ msg: 'Error al listar personas', err: 'error sql' }));
        return;
      }
      this.obj.res.send(JSON.stringify({ msg: 'ok', data: r }));
    });
  }

  findPerson(id) {
    db.query(query.Person.findPerson, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'ok', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Person no encontrado', err: 'no encontrado' }));
      }
    });
  }

  insertPerson(firstName, lastName, nationalId, birthDate) {
    db.query(query.Person.insertPerson, [
      firstName,
      lastName,
      nationalId,
      birthDate || null
    ]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Persona creada', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al crear persona', err: 'error sql' }));
      }
    });
  }

  updatePerson(id, firstName, lastName, nationalId, birthDate) {
    db.query(query.Person.updatePerson, [
      id,
      firstName,
      lastName,
      nationalId,
      birthDate || null
    ]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Persona actualizada', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al actualizar persona', err: 'error sql' }));
      }
    });
  }

  deletePerson(id) {
    db.query(query.Person.deletePerson, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Persona eliminada', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al eliminar persona', err: 'error sql' }));
      }
    });
  }
};

module.exports = Person;
