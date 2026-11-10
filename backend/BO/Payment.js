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

const Payment = class {
  constructor(deps) {
    this.db = deps.db;
    this.query = deps.query;
  }

  async listPayments(payrollEntryId) {
    const err = missing(payrollEntryId, 'entrada');
    if (err) return err;
    const r = await this.db.query(this.query.Payment.listPayments, [payrollEntryId]);
    if (r === false) return { msg: 'Error al listar pagos', err: 'error sql' };
    return { msg: 'ok', data: r };
  }

  async findPayment(id) {
    const r = await this.db.query(this.query.Payment.findPayment, [id]);
    if (r === false) return { msg: 'Error al buscar pago', err: 'error sql' };
    if (!r.length) return { msg: 'Pago no encontrado', err: 'no encontrado' };
    return { msg: 'ok', data: r[0] };
  }

  async insertPayment(payrollEntryId, paymentDate, amount, paymentMethod, notes) {
    const err =
      missing(payrollEntryId, 'entrada') ||
      missing(paymentDate, 'fecha_pago') ||
      missing(amount, 'monto');
    if (err) return err;
    if (!isPositiveNumber(amount)) {
      return { msg: 'El monto debe ser un número válido', err: 'validation' };
    }
    const r = await this.db.query(this.query.Payment.insertPayment, [
      payrollEntryId,
      paymentDate,
      amount,
      paymentMethod || null,
      notes || null
    ]);
    if (r === false) return { msg: 'Error al registrar pago', err: 'error sql' };
    if (!r.length) return { msg: 'Pago no encontrado', err: 'no encontrado' };
    return { msg: 'Pago registrado', data: r[0] };
  }
};

module.exports = Payment;
