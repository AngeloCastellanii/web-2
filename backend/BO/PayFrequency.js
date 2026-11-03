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
    if (r && r.length > 0) return { msg: 'ok', data: r[0] };
    return { msg: 'Pay frequency no encontrado', err: 'no encontrado' };
  }
};

module.exports = PayFrequency;
