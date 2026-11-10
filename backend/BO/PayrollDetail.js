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

const PayrollDetail = class {
  constructor(deps) {
    this.db = deps.db;
    this.query = deps.query;
  }

  async listPayrollDetails(payrollEntryId) {
    const err = missing(payrollEntryId, 'entrada');
    if (err) return err;
    const r = await this.db.query(this.query.PayrollDetail.listPayrollDetails, [payrollEntryId]);
    if (r === false) return { msg: 'Error al listar detalle de nómina', err: 'error sql' };
    return { msg: 'ok', data: r };
  }

  async insertPayrollDetail(payrollEntryId, conceptId, quantity, amount) {
    const err =
      missing(payrollEntryId, 'entrada') ||
      missing(conceptId, 'concepto') ||
      missing(amount, 'monto');
    if (err) return err;
    const qty = quantity === null || quantity === undefined || quantity === '' ? 1 : quantity;
    if (!isPositiveNumber(qty) || !isPositiveNumber(amount)) {
      return { msg: 'Cantidad y monto deben ser números válidos', err: 'validation' };
    }
    const r = await this.db.query(this.query.PayrollDetail.insertPayrollDetail, [
      payrollEntryId,
      conceptId,
      qty,
      amount
    ]);
    if (r === false) return { msg: 'Error al crear detalle de nómina', err: 'error sql' };
    if (!r.length) return { msg: 'Detalle de nómina no encontrado', err: 'no encontrado' };
    return { msg: 'Detalle de nómina creado', data: r[0] };
  }

  async deletePayrollDetail(id) {
    const err = missing(id, 'id');
    if (err) return err;
    const r = await this.db.query(this.query.PayrollDetail.deletePayrollDetail, [id]);
    if (r === false) return { msg: 'Error al eliminar detalle de nómina', err: 'error sql' };
    if (!r.length) return { msg: 'Detalle de nómina no encontrado', err: 'no encontrado' };
    return { msg: 'Detalle de nómina eliminado', data: r[0] };
  }
};

module.exports = PayrollDetail;
