const PayFrequency = class {
  constructor(obj) {
    this.obj = obj;
  }

  listPayFrequencies() {
    db.query(query.PayFrequency.listPayFrequencies, []).then((r) => {
      if (r === false) {
        this.obj.res.send(JSON.stringify({ msg: 'Error listing pay frequencies', err: 'sql error' }));
        return;
      }
      this.obj.res.send(JSON.stringify({ msg: 'ok', data: r }));
    });
  }

  findPayFrequency(id) {
    db.query(query.PayFrequency.findPayFrequency, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'ok', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Pay frequency not found', err: 'not found' }));
      }
    });
  }
};

module.exports = PayFrequency;
