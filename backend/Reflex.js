const fs = require('fs');
const path = require('path');

/**
 * Reflexión desacoplada: carga clases BO en un Map
 * y ejecuta métodos por nombre sin acoplar el servidor a cada BO.
 */
const Reflex = class {
  constructor() {
    this.classMap = new Map();
    this.loadClasses();
  }

  loadClasses() {
    const boDir = path.join(__dirname, 'BO');
    if (!fs.existsSync(boDir)) {
      log.warn('Carpeta BO no encontrada');
      return;
    }

    const files = fs.readdirSync(boDir).filter((f) => f.endsWith('.js'));
    files.forEach((file) => {
      const className = path.basename(file, '.js');
      try {
        // Limpiar cache para hot-reload en desarrollo
        const fullPath = path.join(boDir, file);
        delete require.cache[require.resolve(fullPath)];
        const ClassRef = require(fullPath);
        this.classMap.set(className, ClassRef);
        log.info(`BO registrado: ${className}`);
      } catch (ex) {
        log.error(`No se pudo cargar BO ${className}`, ex.message || ex);
      }
    });
  }

  hasClass(className) {
    return this.classMap.has(className);
  }

  getClass(className) {
    return this.classMap.get(className);
  }

  /**
   * Ejecuta método por reflexión:
   * object_de = nombre de clase, method_de = nombre de método, params = argumentos
   */
  execute(object_de, method_de, params, ctx) {
    if (!this.classMap.has(object_de)) {
      ctx.res.send(JSON.stringify({ msg: 'Objeto no registrado', err: object_de }));
      return false;
    }

    const ClassRef = this.classMap.get(object_de);
    const instance = new ClassRef(ctx);
    const method = instance[method_de];

    if (typeof method !== 'function') {
      ctx.res.send(JSON.stringify({ msg: 'Método no encontrado', err: method_de }));
      return false;
    }

    try {
      method.apply(instance, params || []);
      return true;
    } catch (ex) {
      log.error(ex.message || ex);
      ctx.res
        .status(500)
        .send(JSON.stringify({ msg: 'Error de ejecución', err: String(ex.message || ex) }));
      return false;
    }
  }
};

module.exports = Reflex;
