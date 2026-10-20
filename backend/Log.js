const Log = class {
  constructor(fs) {
    this.fs = fs;
    this.fileName = 'log.txt';
    if (!this.fs.existsSync(this.fileName)) {
      this.fs.writeFileSync(this.fileName, '', 'utf8');
    }
  }

  addToFile(j) {
    switch (j.type) {
      case 'Info': {
        if (config.log.ecoInfo) console.log(j);
        break;
      }
      case 'Error': {
        if (config.log.ecoError) console.log(j);
        break;
      }
      case 'Warning': {
        if (config.log.ecoWarning) console.log(j);
        break;
      }
      case 'Debug': {
        if (config.log.ecoDebug) console.log(j);
        break;
      }
    }

    this.fs.appendFile(this.fileName, JSON.stringify(j) + '\n', (err) => {
      if (err) console.log('ERROR: writing log.txt, err: ' + err);
    });
  }

  info(...msg) {
    this.addToFile({ msg, time: Date.now(), type: 'Info' });
  }

  error(...msg) {
    this.addToFile({ msg, time: Date.now(), type: 'Error' });
  }

  warn(...msg) {
    this.addToFile({ msg, time: Date.now(), type: 'Warning' });
  }

  debug(...msg) {
    this.addToFile({ msg, time: Date.now(), type: 'Debug' });
  }
};

module.exports = Log;
