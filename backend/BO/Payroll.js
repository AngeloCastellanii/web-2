const Payroll = class {
  constructor(deps) {
    this.db = deps.db;
    this.query = deps.query;
  }

  async listPayrolls() {
    const r = await this.db.query(this.query.Payroll.listPayrolls, []);
    if (r === false) return { msg: 'Error al listar nóminas', err: 'error sql' };
    return { msg: 'ok', data: r };
  }

  async findPayroll(id) {
    const r = await this.db.query(this.query.Payroll.findPayroll, [id]);
    if (r === false) return { msg: 'Error al buscar nómina', err: 'error sql' };
    if (!r.length) return { msg: 'Nómina no encontrada', err: 'no encontrado' };
    return { msg: 'ok', data: r[0] };
  }

  async insertPayroll(startDate, endDate, payDate, status, payFrequencyId, notes) {
    const r = await this.db.query(this.query.Payroll.insertPayroll, [
      startDate,
      endDate,
      payDate || null,
      status || 'DRAFT',
      payFrequencyId,
      notes || null
    ]);
    if (r === false) return { msg: 'Error al crear nómina', err: 'error sql' };
    if (!r.length) return { msg: 'Nómina no encontrada', err: 'no encontrado' };
    return { msg: 'Nómina creada', data: r[0] };
  }

  async updatePayroll(id, startDate, endDate, payDate, status, payFrequencyId, notes) {
    const r = await this.db.query(this.query.Payroll.updatePayroll, [
      id,
      startDate,
      endDate,
      payDate || null,
      status || 'DRAFT',
      payFrequencyId,
      notes || null
    ]);
    if (r === false) return { msg: 'Error al actualizar nómina', err: 'error sql' };
    if (!r.length) {
      return { msg: 'Nómina no encontrada o no es borrador', err: 'no encontrado' };
    }
    return { msg: 'Nómina actualizada', data: r[0] };
  }

  async deletePayroll(id) {
    const r = await this.db.query(this.query.Payroll.deletePayroll, [id]);
    if (r === false) return { msg: 'Error al eliminar nómina', err: 'error sql' };
    if (!r.length) {
      return { msg: 'Nómina no encontrada o no es borrador', err: 'no encontrado' };
    }
    return { msg: 'Nómina eliminada', data: r[0] };
  }
};

module.exports = Payroll;
