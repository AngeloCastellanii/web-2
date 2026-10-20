const Person = class {
  constructor(obj) {
    this.obj = obj;
  }

  listPersons() {
    db.query(query.Person.listPersons, []).then((r) => {
      if (r === false) {
        this.obj.res.send(JSON.stringify({ msg: 'Error listing persons', err: 'sql error' }));
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
        this.obj.res.send(JSON.stringify({ msg: 'Person not found', err: 'not found' }));
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
        this.obj.res.send(JSON.stringify({ msg: 'Person created', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error creating person', err: 'sql error' }));
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
        this.obj.res.send(JSON.stringify({ msg: 'Person updated', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error updating person', err: 'sql error' }));
      }
    });
  }

  deletePerson(id) {
    db.query(query.Person.deletePerson, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Person deleted', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error deleting person', err: 'sql error' }));
      }
    });
  }
};

module.exports = Person;
