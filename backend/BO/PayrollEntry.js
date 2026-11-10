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

const PayrollEntry = class {
  constructor(deps) {
    this.db = deps.db;
    this.query = deps.query;
  }

  async listPayrollEntries(payrollId) {
    const err = missing(payrollId, 'nomina');
    if (err) return err;
    const r = await this.db.query(this.query.PayrollEntry.listPayrollEntries, [payrollId]);
    if (r === false) return { msg: 'Error al listar entradas de nómina', err: 'error sql' };
    return { msg: 'ok', data: r };
  }

  async findPayrollEntry(id) {
    const r = await this.db.query(this.query.PayrollEntry.findPayrollEntry, [id]);
    if (r === false) return { msg: 'Error al buscar entrada de nómina', err: 'error sql' };
    if (!r.length) return { msg: 'Entrada de nómina no encontrada', err: 'no encontrado' };
    return { msg: 'ok', data: r[0] };
  }

  async insertPayrollEntry(payrollId, employeeId) {
    const err = missing(payrollId, 'nomina') || missing(employeeId, 'empleado');
    if (err) return err;
    const r = await this.db.query(this.query.PayrollEntry.insertPayrollEntry, [payrollId, employeeId]);
    if (r === false) return { msg: 'Error al crear entrada de nómina', err: 'error sql' };
    if (!r.length) return { msg: 'Entrada de nómina no encontrada', err: 'no encontrado' };
    return { msg: 'Entrada de nómina creada', data: r[0] };
  }

  async deletePayrollEntry(id) {
    const err = missing(id, 'id');
    if (err) return err;
    const r = await this.db.query(this.query.PayrollEntry.deletePayrollEntry, [id]);
    if (r === false) return { msg: 'Error al eliminar entrada de nómina', err: 'error sql' };
    if (!r.length) return { msg: 'Entrada de nómina no encontrada', err: 'no encontrado' };
    return { msg: 'Entrada de nómina eliminada', data: r[0] };
  }
};

module.exports = PayrollEntry;
