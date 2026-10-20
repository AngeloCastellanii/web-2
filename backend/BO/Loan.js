const Loan = class {
  constructor(obj) {
    this.obj = obj;
  }

  listLoans() {
    db.query(query.Loan.listLoans, []).then((r) => {
      if (r === false) {
        this.obj.res.send(JSON.stringify({ msg: 'Error listing loans', err: 'sql error' }));
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
        this.obj.res.send(JSON.stringify({ msg: 'Loan not found', err: 'not found' }));
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
        this.obj.res.send(JSON.stringify({ msg: 'Loan created', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error creating loan', err: 'sql error' }));
      }
    });
  }

  updateLoan(id, remainingBalance, installment, status) {
    db.query(query.Loan.updateLoan, [id, remainingBalance, installment, status]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Loan updated', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error updating loan', err: 'sql error' }));
      }
    });
  }

  deleteLoan(id) {
    db.query(query.Loan.deleteLoan, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Loan closed', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error closing loan', err: 'sql error' }));
      }
    });
  }
};

module.exports = Loan;
