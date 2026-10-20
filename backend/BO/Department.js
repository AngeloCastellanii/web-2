const Department = class {
  constructor(obj) {
    this.obj = obj;
  }

  listDepartments() {
    db.query(query.Department.listDepartments, []).then((r) => {
      if (r === false) {
        this.obj.res.send(JSON.stringify({ msg: 'Error listing departments', err: 'sql error' }));
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
        this.obj.res.send(JSON.stringify({ msg: 'Department not found', err: 'not found' }));
      }
    });
  }

  insertDepartment(name, description) {
    db.query(query.Department.insertDepartment, [name, description || null]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Department created', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error creating department', err: 'sql error' }));
      }
    });
  }

  updateDepartment(id, name, description) {
    db.query(query.Department.updateDepartment, [id, name, description || null]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Department updated', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error updating department', err: 'sql error' }));
      }
    });
  }

  deleteDepartment(id) {
    db.query(query.Department.deleteDepartment, [id]).then((r) => {
      if (r && r.length > 0) {
        this.obj.res.send(JSON.stringify({ msg: 'Department deactivated', data: r[0] }));
      } else {
        this.obj.res.send(JSON.stringify({ msg: 'Error deleting department', err: 'sql error' }));
      }
    });
  }
};

module.exports = Department;
