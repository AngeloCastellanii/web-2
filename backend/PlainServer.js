const session = require('express-session');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Valid = require('./Validate');
const DBComponent = require('./DBComponent');
const Session = require('./Session');
const Security = require('./Security');
const Logger = require('./Log');

global.config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
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
global.sess = new Session(session, app);
global.sec = new Security();

log.info('Starting payroll framework...');

app.use(
  cors({
    origin: config.cors.origin,
    credentials: true
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send(JSON.stringify({ msg: 'Payroll API running', status: 'ok' }));
});

app.post('/proccess', (req, res) => {
  if (sess.sessionExist(req)) {
    const j = {
      object_de: req.body.object_de,
      method_de: req.body.method_de,
      profile_id: req.session.sessionObj.profile_id,
      params: req.body.params || [],
      req,
      res
    };
    if (sec.getPermission(j)) {
      sec.exeMethod(j);
    } else {
      res.send(JSON.stringify({ msg: 'Access denied' }));
    }
  } else {
    res.end(JSON.stringify({ msg: 'You must log in first' }));
  }
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
    `Payroll server active at http://${config.server.ip}:${config.server.port}`
  );
  log.info(
    `Server active at http://${config.server.ip}:${config.server.port}`
  );
});
