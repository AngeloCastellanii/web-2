const Payroll = class {
  constructor(obj) {
    this.obj = obj;
  }

  listPayrolls() {
    db.query(query.Payroll.listPayrolls, []).then((r) => {
      if (r === false) {
        this.obj.res.send(JSON.stringify({ msg: 'Error al listar nóminas', err: 'error sql' }));
        return;
      }
      this.obj.res.send(JSON.stringify({ msg: 'ok', data: r }));
    });
  }

  findPayroll(id) {
    db.query(query.Payroll.findPayroll, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'ok', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Payroll no encontrado', err: 'no encontrado' }));
      }
    });
  }

  insertPayroll(startDate, endDate, payDate, status, payFrequencyId, notes) {
    const st = status || 'DRAFT';
    db.query(query.Payroll.insertPayroll, [
      startDate,
      endDate,
      payDate || null,
      st,
      payFrequencyId,
      notes || null
    ]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Nómina creada', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al crear nómina', err: 'error sql' }));
      }
    });
  }

  updatePayroll(id, startDate, endDate, payDate, status, payFrequencyId, notes) {
    db.query(query.Payroll.updatePayroll, [
      id,
      startDate,
      endDate,
      payDate || null,
      status || 'DRAFT',
      payFrequencyId,
      notes || null
    ]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Nómina actualizada', data: r[0] }));
      } else {
        this.obj.res.send(
          JSON.stringify({
            msg: 'Error al actualizar nómina (solo borrador se puede editar)',
            err: 'error sql'
          })
        );
      }
    });
  }

  deletePayroll(id) {
    db.query(query.Payroll.deletePayroll, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Nómina eliminada', data: r[0] }));
      } else {
        this.obj.res.send(
          JSON.stringify({
            msg: 'Error al eliminar nómina (solo borrador se puede eliminar)',
            err: 'error sql'
          })
        );
      }
    });
  }
};

module.exports = Payroll;
