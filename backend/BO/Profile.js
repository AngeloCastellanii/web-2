const Profile = class {
  constructor(deps) {
    this.db = deps.db;
    this.query = deps.query;
  }

  async listProfiles() {
    const r = await this.db.query(this.query.Profile.listProfiles, []);
    if (r === false) return { msg: 'Error al listar perfiles', err: 'error sql' };
    return { msg: 'ok', data: r };
  }

  async findProfile(id) {
    const r = await this.db.query(this.query.Profile.findProfile, [id]);
    if (r === false) return { msg: 'Error al buscar perfil', err: 'error sql' };
    if (!r.length) return { msg: 'Perfil no encontrado', err: 'no encontrado' };
    return { msg: 'ok', data: r[0] };
  }
};

module.exports = Profile;
