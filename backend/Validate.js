const Validate = class {
  constructor() {}

  isValidInteger(value) {
    const a = String(value).split('.');
    const v = isNaN(value);
    if (v || a.length !== 1) return false;
    return true;
  }

  isValidEmail(email) {
    const emailRegx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || typeof email !== 'string') return false;
    return emailRegx.test(email);
  }

  isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (String(value).trim() === '') return true;
    return false;
  }
};

module.exports = Validate;
