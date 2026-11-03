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
    if (r && r.length > 0) return { msg: 'ok', data: r[0] };
    return { msg: 'Payroll no encontrado', err: 'no encontrado' };
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
    if (r && r.length > 0) return { msg: 'Nómina creada', data: r[0] };
    return { msg: 'Error al crear nómina', err: 'error sql' };
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
    if (r && r.length > 0) return { msg: 'Nómina actualizada', data: r[0] };
    return {
      msg: 'Error al actualizar nómina (solo borrador se puede editar)',
      err: 'error sql'
    };
  }

  async deletePayroll(id) {
    const r = await this.db.query(this.query.Payroll.deletePayroll, [id]);
    if (r && r.length > 0) return { msg: 'Nómina eliminada', data: r[0] };
    return {
      msg: 'Error al eliminar nómina (solo borrador se puede eliminar)',
      err: 'error sql'
    };
  }
};

module.exports = Payroll;
