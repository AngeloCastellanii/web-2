function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (String(value).trim() === '') return true;
  return false;
}

function missing(value, label) {
  if (isEmpty(value) && value !== 0 && value !== false) {
    return { msg: `El campo ${label} es obligatorio`, err: 'validation' };
  }
  return null;
}

function isPositiveNumber(value) {
  const n = Number(value);
  return !isNaN(n) && n >= 0;
}

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
    const err =
      missing(employeeId, 'empleado') ||
      missing(totalAmount, 'monto_total') ||
      missing(remainingBalance, 'saldo') ||
      missing(installment, 'cuota') ||
      missing(startDate, 'fecha_inicio');
    if (err) return err;
    if (!isPositiveNumber(totalAmount) || !isPositiveNumber(installment)) {
      return { msg: 'Monto y cuota deben ser números válidos', err: 'validation' };
    }
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
    const err =
      missing(id, 'id') ||
      missing(remainingBalance, 'saldo') ||
      missing(installment, 'cuota') ||
      missing(status, 'estado');
    if (err) return err;
    if (!isPositiveNumber(remainingBalance) || !isPositiveNumber(installment)) {
      return { msg: 'Saldo y cuota deben ser números válidos', err: 'validation' };
    }
    const r = await this.db.query(this.query.Loan.updateLoan, [id, remainingBalance, installment, status]);
    if (r === false) return { msg: 'Error al actualizar préstamo', err: 'error sql' };
    if (!r.length) return { msg: 'Préstamo no encontrado', err: 'no encontrado' };
    return { msg: 'Préstamo actualizado', data: r[0] };
  }

  async deleteLoan(id) {
    const err = missing(id, 'id');
    if (err) return err;
    const r = await this.db.query(this.query.Loan.deleteLoan, [id]);
    if (r === false) return { msg: 'Error al cerrar préstamo', err: 'error sql' };
    if (!r.length) return { msg: 'Préstamo no encontrado', err: 'no encontrado' };
    return { msg: 'Préstamo cerrado', data: r[0] };
  }
};

module.exports = Loan;
