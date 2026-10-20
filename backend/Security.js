/**
 * Seguridad desacoplada: permisos en Map.
 * No conoce la lógica de negocio; solo autoriza y delega a Reflex.execute.
 */
const Security = class {
  constructor(reflex) {
    this.reflex = reflex;
    this.permissionMethod = new Map();
    this.loadPermission();
  }

  loadPermission() {
    db.query(query.Security.loadPermissions, null).then((r) => {
      if (!r) {
        log.error('No se pudieron cargar los permisos');
        return;
      }
      this.permissionMethod.clear();
      r.forEach((element) => {
        const key =
          element.object_de + '_' + element.method_de + '_' + element.profile_id;
        this.permissionMethod.set(key, true);
      });
      log.info(`Permisos cargados en Map: ${this.permissionMethod.size}`);
    });
  }

  buildKey(object_de, method_de, profile_id) {
    return object_de + '_' + method_de + '_' + profile_id;
  }

  getPermission(objPermission) {
    const key = this.buildKey(
      objPermission.object_de,
      objPermission.method_de,
      objPermission.profile_id
    );
    return this.permissionMethod.has(key)
      ? this.permissionMethod.get(key)
      : false;
  }

  /**
   * Flujo desacoplado:
   * permiso (Map) -> ValidationMap -> Reflex.execute
   */
  exeMethod(obj) {
    if (!this.getPermission(obj)) {
      obj.res.send(JSON.stringify({ msg: 'Acceso denegado' }));
      return;
    }

    const check = valid.validate(obj.object_de, obj.method_de, obj.params || []);
    if (!check.ok) {
      obj.res.send(JSON.stringify({ msg: check.msg, err: 'validation' }));
      return;
    }

    this.reflex.execute(
      obj.object_de,
      obj.method_de,
      obj.params || [],
      obj
    );
  }
};

module.exports = Security;
