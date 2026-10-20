const Payroll = class {
  constructor(obj) {
    this.obj = obj;
  }

  listPayrolls() {
    db.query(query.Payroll.listPayrolls, []).then((r) => {
      if (r === false) {
        this.obj.res.send(JSON.stringify({ msg: 'Error listing payrolls', err: 'sql error' }));
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
        this.obj.res.send(JSON.stringify({ msg: 'Payroll not found', err: 'not found' }));
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
        this.obj.res.send(JSON.stringify({ msg: 'Payroll created', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error creating payroll', err: 'sql error' }));
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
        this.obj.res.send(JSON.stringify({ msg: 'Payroll updated', data: r[0] }));
      } else {
        this.obj.res.send(
          JSON.stringify({
            msg: 'Error updating payroll (only DRAFT can be edited)',
            err: 'sql error'
          })
        );
      }
    });
  }

  deletePayroll(id) {
    db.query(query.Payroll.deletePayroll, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Payroll deleted', data: r[0] }));
      } else {
        this.obj.res.send(
          JSON.stringify({
            msg: 'Error deleting payroll (only DRAFT can be deleted)',
            err: 'sql error'
          })
        );
      }
    });
  }
};

module.exports = Payroll;
