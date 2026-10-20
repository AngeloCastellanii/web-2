const Department = class {
  constructor(obj) {
    this.obj = obj;
  }

  listDepartments() {
    db.query(query.Department.listDepartments, []).then((r) => {
      if (r === false) {
        this.obj.res.send(JSON.stringify({ msg: 'Error al listar departamentos', err: 'error sql' }));
        return;
      }
      this.obj.res.send(JSON.stringify({ msg: 'ok', data: r }));
    });
  }

  findDepartment(id) {
    db.query(query.Department.findDepartment, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'ok', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Department no encontrado', err: 'no encontrado' }));
      }
    });
  }

  insertDepartment(name, description) {
    db.query(query.Department.insertDepartment, [name, description || null]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Departamento creado', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al crear departamento', err: 'error sql' }));
      }
    });
  }

  updateDepartment(id, name, description) {
    db.query(query.Department.updateDepartment, [id, name, description || null]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Departamento actualizado', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al actualizar departamento', err: 'error sql' }));
      }
    });
  }

  deleteDepartment(id) {
    db.query(query.Department.deleteDepartment, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Departamento desactivado', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error al eliminar departamento', err: 'error sql' }));
      }
    });
  }
};

module.exports = Department;
