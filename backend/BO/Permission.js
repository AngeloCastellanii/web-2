const Permission = class {
  constructor(deps) {
    this.db = deps.db;
    this.query = deps.query;
  }

  async listMethods() {
    const r = await this.db.query(this.query.Permission.listMethods, []);
    if (r === false) return { msg: 'Error al listar métodos', err: 'error sql' };
    return { msg: 'ok', data: r };
  }

  async listPermissionsByProfile(profileId) {
    const r = await this.db.query(this.query.Permission.listPermissionsByProfile, [profileId]);
    if (r === false) return { msg: 'Error al listar permisos', err: 'error sql' };
    return { msg: 'ok', data: r };
  }

  async grantPermission(profileId, methodId) {
    const r = await this.db.query(this.query.Permission.grantPermission, [profileId, methodId]);
    if (r === false) return { msg: 'Error al otorgar permiso', err: 'error sql' };
    if (global.sec && global.sec.loadPermission) await global.sec.loadPermission();
    if (!r.length) return { msg: 'El permiso ya existía' };
    return { msg: 'Permiso otorgado', data: r[0] };
  }

  async revokePermission(profileId, methodId) {
    const r = await this.db.query(this.query.Permission.revokePermission, [profileId, methodId]);
    if (r === false) return { msg: 'Error al quitar permiso', err: 'error sql' };
    if (!r.length) return { msg: 'Permiso no encontrado', err: 'no encontrado' };
    if (global.sec && global.sec.loadPermission) await global.sec.loadPermission();
    return { msg: 'Permiso quitado', data: r[0] };
  }
};

module.exports = Permission;
