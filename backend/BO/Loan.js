const Loan = class {
  constructor(obj) {
    this.obj = obj;
  }

  listLoans() {
    db.query(query.Loan.listLoans, []).then((r) => {
      if (r === false) {
        this.obj.res.send(JSON.stringify({ msg: 'Error al listar préstamos', err: 'error sql' }));
        return;
      }
      this.obj.res.send(JSON.stringify({ msg: 'ok', data: r }));
    });
  }

  findLoan(id) {
    db.query(query.Loan.findLoan, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'ok', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Loan no encontrado', err: 'no encontrado' }));
      }
    });
  }

  insertLoan(employeeId, totalAmount, remainingBalance, installment, startDate, status) {
    const balance = remainingBalance != null ? remainingBalance : totalAmount;
    db.query(query.Loan.insertLoan, [
      employeeId,
      totalAmount,
      balance,
      installment,
      startDate,
      status || 'ACTIVE'
    ]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Préstamo creado', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al crear préstamo', err: 'error sql' }));
      }
    });
  }

  updateLoan(id, remainingBalance, installment, status) {
    db.query(query.Loan.updateLoan, [id, remainingBalance, installment, status]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Préstamo actualizado', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al actualizar préstamo', err: 'error sql' }));
      }
    });
  }

  deleteLoan(id) {
    db.query(query.Loan.deleteLoan, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Préstamo cerrado', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al cerrar préstamo', err: 'error sql' }));
      }
    });
  }
};

module.exports = Loan;
