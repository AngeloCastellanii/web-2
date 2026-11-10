const fs = require('fs');
const path = require('path');

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

    fs.readdirSync(boDir)
      .filter((file) => file.endsWith('.js'))
      .forEach((file) => {
        const className = path.basename(file, '.js');
        try {
          const ClassRef = require(path.join(boDir, file));
          this.classMap.set(className, ClassRef);
          log.info(`BO registrado: ${className}`);
        } catch (ex) {
          log.error(`No se pudo cargar BO ${className}`, ex.message || ex);
        }
      });
  }

  getClass(className) {
    return this.classMap.get(className);
  }
};

module.exports = Reflex;
