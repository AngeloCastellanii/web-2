const Security = class {
  constructor() {
    this.permissionMethod = new Map();
  }

  async loadPermission() {
    const r = await db.query(query.Security.loadPermissions, null);
    if (!r) {
      log.error('No se pudieron cargar los permisos');
      return;
    }
    this.permissionMethod.clear();
    r.forEach((element) => {
      const key = element.object_de + '_' + element.method_de + '_' + element.profile_id;
      this.permissionMethod.set(key, true);
    });
    log.info(`Permisos cargados en Map: ${this.permissionMethod.size}`);
  }

  getPermission(objPermission) {
    const key =
      objPermission.object_de + '_' + objPermission.method_de + '_' + objPermission.profile_id;
    return this.permissionMethod.has(key) ? this.permissionMethod.get(key) : false;
  }

  async exeMethod(obj) {
    if (!this.getPermission(obj)) {
      obj.res.json({ msg: 'Acceso denegado' });
      return;
    }

    if (!/^[A-Za-z]+$/.test(obj.object_de || '')) {
      obj.res.json({ msg: 'Objeto no válido' });
      return;
    }

    let ClassRef;
    try {
      ClassRef = require(`./BO/${obj.object_de}`);
    } catch (ex) {
      obj.res.json({ msg: 'Objeto no registrado', err: obj.object_de });
      return;
    }

    const instance = new ClassRef({ db: obj.db, query: obj.query });
    const method = instance[obj.method_de];
    if (typeof method !== 'function') {
      obj.res.json({ msg: 'Método no encontrado', err: obj.method_de });
      return;
    }

    try {
      const result = await method.apply(instance, obj.params || []);
      obj.res.json(result);
    } catch (ex) {
      log.error(ex.message || ex);
      obj.res
        .status(500)
        .json({ msg: 'Error de ejecución', err: String(ex.message || ex) });
    }
  }
};

module.exports = Security;
