const Person = class {
  constructor(deps) {
    this.db = deps.db;
    this.query = deps.query;
  }

  async listPersons() {
    const r = await this.db.query(this.query.Person.listPersons, []);
    if (r === false) return { msg: 'Error al listar personas', err: 'error sql' };
    return { msg: 'ok', data: r };
  }

  async findPerson(id) {
    const r = await this.db.query(this.query.Person.findPerson, [id]);
    if (r && r.length > 0) return { msg: 'ok', data: r[0] };
    return { msg: 'Person no encontrado', err: 'no encontrado' };
  }

  async insertPerson(firstName, lastName, nationalId, birthDate) {
    const r = await this.db.query(this.query.Person.insertPerson, [
      firstName,
      lastName,
      nationalId,
      birthDate || null
    ]);
    if (r && r.length > 0) return { msg: 'Persona creada', data: r[0] };
    return { msg: 'Error al crear persona', err: 'error sql' };
  }

  async updatePerson(id, firstName, lastName, nationalId, birthDate) {
    const r = await this.db.query(this.query.Person.updatePerson, [
      id,
      firstName,
      lastName,
      nationalId,
      birthDate || null
    ]);
    if (r && r.length > 0) return { msg: 'Persona actualizada', data: r[0] };
    return { msg: 'Error al actualizar persona', err: 'error sql' };
  }

  async deletePerson(id) {
    const r = await this.db.query(this.query.Person.deletePerson, [id]);
    if (r && r.length > 0) return { msg: 'Persona eliminada', data: r[0] };
    return { msg: 'Error al eliminar persona', err: 'error sql' };
  }
};

module.exports = Person;
