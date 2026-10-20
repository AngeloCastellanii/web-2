/**
 * Validación desacoplada: ValidationMap
 * clave = object_de + '_' + method_de → función (params) => { ok, msg }
 */
const Validate = class {
  constructor() {
    this.validationMap = new Map();
    this.loadRules();
  }

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

  isPositiveNumber(value) {
    const n = Number(value);
    return !isNaN(n) && n >= 0;
  }

  requireParams(params, minLength, labels) {
    if (!Array.isArray(params) || params.length < minLength) {
      return { ok: false, msg: 'Faltan parámetros requeridos' };
    }
    for (let i = 0; i < minLength; i++) {
      if (this.isEmpty(params[i]) && params[i] !== 0 && params[i] !== false) {
        const label = labels[i] || `parametro_${i + 1}`;
        return { ok: false, msg: `El campo ${label} es obligatorio` };
      }
    }
    return { ok: true };
  }

  loadRules() {
    // Department: insertDepartment(name, description) | updateDepartment(id, name, description)
    this.validationMap.set('Department_insertDepartment', (params) =>
      this.requireParams(params, 1, ['nombre'])
    );
    this.validationMap.set('Department_updateDepartment', (params) =>
      this.requireParams(params, 2, ['id', 'nombre'])
    );
    this.validationMap.set('Department_deleteDepartment', (params) =>
      this.requireParams(params, 1, ['id'])
    );

    // Position
    this.validationMap.set('Position_insertPosition', (params) =>
      this.requireParams(params, 1, ['nombre'])
    );
    this.validationMap.set('Position_updatePosition', (params) =>
      this.requireParams(params, 2, ['id', 'nombre'])
    );
    this.validationMap.set('Position_deletePosition', (params) =>
      this.requireParams(params, 1, ['id'])
    );

    // Person: insertPerson(firstName, lastName, nationalId, birthDate)
    this.validationMap.set('Person_insertPerson', (params) =>
      this.requireParams(params, 3, ['nombre', 'apellido', 'cedula'])
    );
    this.validationMap.set('Person_updatePerson', (params) =>
      this.requireParams(params, 4, ['id', 'nombre', 'apellido', 'cedula'])
    );
    this.validationMap.set('Person_deletePerson', (params) =>
      this.requireParams(params, 1, ['id'])
    );

    // Employee: insertEmployee(personId, hireDate, payModality, baseSalary, freq, dept, position)
    this.validationMap.set('Employee_insertEmployee', (params) => {
      const base = this.requireParams(params, 7, [
        'persona',
        'fecha_ingreso',
        'modalidad',
        'salario',
        'periodicidad',
        'departamento',
        'cargo'
      ]);
      if (!base.ok) return base;
      if (!this.isPositiveNumber(params[3])) {
        return { ok: false, msg: 'El salario debe ser un número válido' };
      }
      return { ok: true };
    });
    this.validationMap.set('Employee_updateEmployee', (params) => {
      const base = this.requireParams(params, 7, [
        'id',
        'fecha_ingreso',
        'modalidad',
        'salario',
        'periodicidad',
        'departamento',
        'cargo'
      ]);
      if (!base.ok) return base;
      if (!this.isPositiveNumber(params[3])) {
        return { ok: false, msg: 'El salario debe ser un número válido' };
      }
      return { ok: true };
    });
    this.validationMap.set('Employee_deleteEmployee', (params) =>
      this.requireParams(params, 1, ['id'])
    );

    // Concept: insertConcept(name, effect, category, isAutomatic, calcType, calcValue)
    this.validationMap.set('Concept_insertConcept', (params) => {
      const base = this.requireParams(params, 3, ['nombre', 'efecto', 'categoria']);
      if (!base.ok) return base;
      if (params[1] !== 'CREDIT' && params[1] !== 'DEBIT') {
        return { ok: false, msg: 'El efecto debe ser CREDIT o DEBIT' };
      }
      return { ok: true };
    });
    this.validationMap.set('Concept_updateConcept', (params) => {
      const base = this.requireParams(params, 4, ['id', 'nombre', 'efecto', 'categoria']);
      if (!base.ok) return base;
      if (params[2] !== 'CREDIT' && params[2] !== 'DEBIT') {
        return { ok: false, msg: 'El efecto debe ser CREDIT o DEBIT' };
      }
      return { ok: true };
    });
    this.validationMap.set('Concept_deleteConcept', (params) =>
      this.requireParams(params, 1, ['id'])
    );

    // Payroll: insertPayroll(start, end, payDate, status, frequencyId, notes)
    // fecha_pago puede ir vacía
    this.validationMap.set('Payroll_insertPayroll', (params) => {
      if (!Array.isArray(params) || params.length < 5) {
        return { ok: false, msg: 'Faltan parámetros requeridos' };
      }
      if (this.isEmpty(params[0])) return { ok: false, msg: 'El campo fecha_inicio es obligatorio' };
      if (this.isEmpty(params[1])) return { ok: false, msg: 'El campo fecha_fin es obligatorio' };
      if (this.isEmpty(params[4]) && params[4] !== 0) {
        return { ok: false, msg: 'El campo periodicidad es obligatorio' };
      }
      return { ok: true };
    });
    this.validationMap.set('Payroll_updatePayroll', (params) => {
      if (!Array.isArray(params) || params.length < 6) {
        return { ok: false, msg: 'Faltan parámetros requeridos' };
      }
      if (this.isEmpty(params[0]) && params[0] !== 0) {
        return { ok: false, msg: 'El campo id es obligatorio' };
      }
      if (this.isEmpty(params[1])) return { ok: false, msg: 'El campo fecha_inicio es obligatorio' };
      if (this.isEmpty(params[2])) return { ok: false, msg: 'El campo fecha_fin es obligatorio' };
      if (this.isEmpty(params[5]) && params[5] !== 0) {
        return { ok: false, msg: 'El campo periodicidad es obligatorio' };
      }
      return { ok: true };
    });
    this.validationMap.set('Payroll_deletePayroll', (params) =>
      this.requireParams(params, 1, ['id'])
    );

    // Loan: insertLoan(employeeId, total, balance, installment, startDate, status)
    this.validationMap.set('Loan_insertLoan', (params) => {
      const base = this.requireParams(params, 5, [
        'empleado',
        'monto_total',
        'saldo',
        'cuota',
        'fecha_inicio'
      ]);
      if (!base.ok) return base;
      if (!this.isPositiveNumber(params[1]) || !this.isPositiveNumber(params[3])) {
        return { ok: false, msg: 'Monto y cuota deben ser números válidos' };
      }
      return { ok: true };
    });
    this.validationMap.set('Loan_updateLoan', (params) => {
      const base = this.requireParams(params, 4, ['id', 'saldo', 'cuota', 'estado']);
      if (!base.ok) return base;
      if (!this.isPositiveNumber(params[1]) || !this.isPositiveNumber(params[2])) {
        return { ok: false, msg: 'Saldo y cuota deben ser números válidos' };
      }
      return { ok: true };
    });
    this.validationMap.set('Loan_deleteLoan', (params) =>
      this.requireParams(params, 1, ['id'])
    );

    log.info(`ValidationMap cargado: ${this.validationMap.size} reglas`);
  }

  buildKey(object_de, method_de) {
    return object_de + '_' + method_de;
  }

  /**
   * Si no hay regla en el Map, se permite (listados, finds, etc.).
   * Si hay regla, se ejecuta y retorna { ok, msg }.
   */
  validate(object_de, method_de, params) {
    const key = this.buildKey(object_de, method_de);
    if (!this.validationMap.has(key)) {
      return { ok: true };
    }
    const rule = this.validationMap.get(key);
    return rule(params || []);
  }
};

module.exports = Validate;
