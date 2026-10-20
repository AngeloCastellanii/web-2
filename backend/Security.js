const Security = class {
  constructor() {
    this.permissionMethod = new Map();
    this.loadPermission();
  }

  loadPermission() {
    db.query(query.Security.loadPermissions, null).then((r) => {
      if (!r) {
        log.error('Could not load permissions');
        return;
      }
      r.forEach((element) => {
        const key =
          element.object_de + '_' + element.method_de + '_' + element.profile_id;
        this.permissionMethod.set(key, true);
      });
      log.info(`Permissions loaded: ${this.permissionMethod.size}`);
    });
  }

  getPermission(objPermission) {
    const key =
      objPermission.object_de +
      '_' +
      objPermission.method_de +
      '_' +
      objPermission.profile_id;
    if (this.permissionMethod.has(key)) {
      return this.permissionMethod.get(key);
    }
    return false;
  }

  exeMethod(obj) {
    try {
      const c = require(`./BO/${obj.object_de}`);
      const i = new c(obj);
      if (typeof i[obj.method_de] !== 'function') {
        obj.res.send(JSON.stringify({ msg: 'Method not found' }));
        return;
      }
      i[obj.method_de](...(obj.params || []));
    } catch (ex) {
      log.error(ex.message || ex);
      obj.res.status(500).send(JSON.stringify({ msg: 'Execution error', err: String(ex.message || ex) }));
    }
  }
};

module.exports = Security;
