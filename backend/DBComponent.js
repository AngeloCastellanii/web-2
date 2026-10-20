const { Pool } = require('pg');

const DBComponent = class {
  constructor() {
    this.pool = new Pool(config.db);
  }

  async query(sentence, params) {
    try {
      const resultSet = await this.pool.query(sentence, params);
      return resultSet.rows;
    } catch (ex) {
      if (typeof log !== 'undefined') log.error(ex.message || ex);
      return false;
    }
  }
};

module.exports = DBComponent;
