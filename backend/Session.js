const Session = class {
  constructor(ssn, app) {
    app.use(ssn(config.session));
  }

  sessionExist(req) {
    if (req.session.sessionObj) return true;
    return false;
  }

  createSession(req, r) {
    req.session.sessionObj = {
      user_na: r[0].email,
      user_id: r[0].user_id,
      profile_id: r[0].profile_id,
      person_id: r[0].person_id,
      first_name: r[0].first_name,
      last_name: r[0].last_name
    };
  }

  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send(JSON.stringify({ msg: 'Logout error' }));
        return;
      }
      res.send(JSON.stringify({ msg: 'Session ended' }));
    });
  }

  login(req, res) {
    if (req.body.user && req.body.pw) {
      this.authenticate(req, (r) => {
        if (r && r.length > 0) {
          this.createSession(req, r);
          res.end(
            JSON.stringify({
              msg: `Session created for ${r[0].email}`,
              user: {
                user_id: r[0].user_id,
                email: r[0].email,
                profile_id: r[0].profile_id,
                first_name: r[0].first_name,
                last_name: r[0].last_name
              }
            })
          );
        } else {
          res.end(JSON.stringify({ msg: 'User does not exist' }));
        }
      });
    } else {
      res.end(JSON.stringify({ msg: 'Invalid login data' }));
    }
  }

  me(req, res) {
    if (this.sessionExist(req)) {
      res.send(JSON.stringify({ user: req.session.sessionObj }));
    } else {
      res.status(401).send(JSON.stringify({ msg: 'No active session' }));
    }
  }

  authenticate(req, callback) {
    const user = req.body.user;
    const pw = req.body.pw;
    db.query(query.Session.authenticate, [user, pw]).then((r) => {
      if (r && r.length > 0) callback(r);
      else callback(false);
    });
  }
};

module.exports = Session;
