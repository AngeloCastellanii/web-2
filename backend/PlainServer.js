const session = require('express-session');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Valid = require('./Validate');
const DBComponent = require('./DBComponent');
const Session = require('./Session');
const Security = require('./Security');
const Reflex = require('./Reflex');
const Logger = require('./Log');

function deepMerge(base, overlay) {
  const out = { ...base };
  Object.keys(overlay || {}).forEach((key) => {
    if (
      overlay[key] &&
      typeof overlay[key] === 'object' &&
      !Array.isArray(overlay[key])
    ) {
      out[key] = deepMerge(base[key] || {}, overlay[key]);
    } else {
      out[key] = overlay[key];
    }
  });
  return out;
}

global.config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const localConfigPath = path.join(__dirname, 'config.local.json');
if (fs.existsSync(localConfigPath)) {
  const localConfig = JSON.parse(fs.readFileSync(localConfigPath, 'utf8'));
  global.config = deepMerge(global.config, localConfig);
}
if (process.env.PGPASSWORD) config.db.password = process.env.PGPASSWORD;
if (process.env.PGPORT) config.db.port = Number(process.env.PGPORT);
if (process.env.PGDATABASE) config.db.database = process.env.PGDATABASE;
if (process.env.PGUSER) config.db.user = process.env.PGUSER;
if (process.env.PGHOST) config.db.host = process.env.PGHOST;
global.query = JSON.parse(fs.readFileSync(path.join(__dirname, 'Querys.json'), 'utf8'));
global.db = new DBComponent();
global.log = new Logger(fs);
global.valid = new Valid();

const app = express();

// Capas: Session | Reflex (classMap) | Security (permissionMap) | Validate (validationMap)
global.sess = new Session(session, app);
global.reflex = new Reflex();
global.sec = new Security(global.reflex);

log.info('Iniciando framework de nómina...');

app.use(
  cors({
    origin: config.cors.origin,
    credentials: true
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send(JSON.stringify({ msg: 'API de nómina activa', status: 'ok' }));
});

/**
 * Único punto de entrada de negocio.
 * El servidor no conoce BOs:
 * sesión -> permiso (Map) -> ValidationMap -> Reflex.execute
 */
app.post('/proccess', (req, res) => {
  if (!sess.sessionExist(req)) {
    res.end(JSON.stringify({ msg: 'Debe iniciar sesión primero' }));
    return;
  }

  const ctx = {
    object_de: req.body.object_de,
    method_de: req.body.method_de,
    profile_id: req.session.sessionObj.profile_id,
    params: req.body.params || [],
    req,
    res
  };

  sec.exeMethod(ctx);
});

app.post('/login', (req, res) => {
  sess.login(req, res);
});

app.post('/logout', (req, res) => {
  sess.logout(req, res);
});

app.get('/me', (req, res) => {
  sess.me(req, res);
});

app.listen(config.server.port, () => {
  console.log(
    `Servidor de nómina activo en http://${config.server.ip}:${config.server.port}`
  );
  log.info(
    `Servidor activo en http://${config.server.ip}:${config.server.port}`
  );
});
