const PayFrequency = class {
  constructor(deps) {
    this.db = deps.db;
    this.query = deps.query;
  }

  async listPayFrequencies() {
    const r = await this.db.query(this.query.PayFrequency.listPayFrequencies, []);
    if (r === false) return { msg: 'Error al listar periodicidades', err: 'error sql' };
    return { msg: 'ok', data: r };
  }

  async findPayFrequency(id) {
    const r = await this.db.query(this.query.PayFrequency.findPayFrequency, [id]);
    if (r === false) return { msg: 'Error al buscar periodicidad', err: 'error sql' };
    if (!r.length) return { msg: 'Periodicidad no encontrada', err: 'no encontrado' };
    return { msg: 'ok', data: r[0] };
  }
};

module.exports = PayFrequency;
