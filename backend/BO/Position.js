const Position = class {
  constructor(obj) {
    this.obj = obj;
  }

  listPositions() {
    db.query(query.Position.listPositions, []).then((r) => {
      if (r === false) {
        this.obj.res.send(JSON.stringify({ msg: 'Error listing positions', err: 'sql error' }));
        return;
      }
      this.obj.res.send(JSON.stringify({ msg: 'ok', data: r }));
    });
  }

  findPosition(id) {
    db.query(query.Position.findPosition, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'ok', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Position not found', err: 'not found' }));
      }
    });
  }

  insertPosition(name, description) {
    db.query(query.Position.insertPosition, [name, description || null]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Position created', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error creating position', err: 'sql error' }));
      }
    });
  }

  updatePosition(id, name, description) {
    db.query(query.Position.updatePosition, [id, name, description || null]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Position updated', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error updating position', err: 'sql error' }));
      }
    });
  }

  deletePosition(id) {
    db.query(query.Position.deletePosition, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Position deactivated', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error deleting position', err: 'sql error' }));
      }
    });
  }
};

module.exports = Position;
