const Position = class {
  constructor(obj) {
    this.obj = obj;
  }

  listPositions() {
    db.query(query.Position.listPositions, []).then((r) => {
      if (r === false) {
        this.obj.res.send(JSON.stringify({ msg: 'Error al listar cargos', err: 'error sql' }));
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
        this.obj.res.send(JSON.stringify({ msg: 'Position no encontrado', err: 'no encontrado' }));
      }
    });
  }

  insertPosition(name, description) {
    db.query(query.Position.insertPosition, [name, description || null]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Cargo creado', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al crear cargo', err: 'error sql' }));
      }
    });
  }

  updatePosition(id, name, description) {
    db.query(query.Position.updatePosition, [id, name, description || null]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Cargo actualizado', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al actualizar cargo', err: 'error sql' }));
      }
    });
  }

  deletePosition(id) {
    db.query(query.Position.deletePosition, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Cargo desactivado', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al eliminar cargo', err: 'error sql' }));
      }
    });
  }
};

module.exports = Position;
