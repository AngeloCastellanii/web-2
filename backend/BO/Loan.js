const Loan = class {
  constructor(deps) {
    this.db = deps.db;
    this.query = deps.query;
  }

  async listLoans() {
    const r = await this.db.query(this.query.Loan.listLoans, []);
    if (r === false) return { msg: 'Error al listar préstamos', err: 'error sql' };
    return { msg: 'ok', data: r };
  }

  async findLoan(id) {
    const r = await this.db.query(this.query.Loan.findLoan, [id]);
    if (r === false) return { msg: 'Error al buscar préstamo', err: 'error sql' };
    if (!r.length) return { msg: 'Préstamo no encontrado', err: 'no encontrado' };
    return { msg: 'ok', data: r[0] };
  }

  async insertLoan(employeeId, totalAmount, remainingBalance, installment, startDate, status) {
    const r = await this.db.query(this.query.Loan.insertLoan, [
      employeeId,
      totalAmount,
      remainingBalance,
      installment,
      startDate,
      status || 'ACTIVE'
    ]);
    if (r === false) return { msg: 'Error al crear préstamo', err: 'error sql' };
    if (!r.length) return { msg: 'Préstamo no encontrado', err: 'no encontrado' };
    return { msg: 'Préstamo creado', data: r[0] };
  }

  async updateLoan(id, remainingBalance, installment, status) {
    const r = await this.db.query(this.query.Loan.updateLoan, [id, remainingBalance, installment, status]);
    if (r === false) return { msg: 'Error al actualizar préstamo', err: 'error sql' };
    if (!r.length) return { msg: 'Préstamo no encontrado', err: 'no encontrado' };
    return { msg: 'Préstamo actualizado', data: r[0] };
  }

  async deleteLoan(id) {
    const r = await this.db.query(this.query.Loan.deleteLoan, [id]);
    if (r === false) return { msg: 'Error al cerrar préstamo', err: 'error sql' };
    if (!r.length) return { msg: 'Préstamo no encontrado', err: 'no encontrado' };
    return { msg: 'Préstamo cerrado', data: r[0] };
  }
};

module.exports = Loan;
