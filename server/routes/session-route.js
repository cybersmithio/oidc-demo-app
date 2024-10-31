// import dependencies and initialize the express router
const express = require('express');
const OAuthController = require('../controllers/oauth-controller');
const config = require('../controllers/config').Config;

const oauthController = new OAuthController(config.scope);
const router = express.Router();
var passport = require('passport');
var OpenIDConnectStrategy = require('passport-openidconnect');


passport.use(new OpenIDConnectStrategy({
    issuer: 'https://cybersmithio.verify.ibm.com',
    authorizationURL: config.authnUrl,
    tokenURL: 'https://cybersmithio.verify.ibm.com/token',
    userInfoURL: 'https://cybersmithio.verify.ibm.com/userinfo',
    clientID: config.clientId,
    clientSecret: config.clientSecret,
    callbackURL: config.redirectUri
  },
  function verify(issuer, profile, cb) {
    db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
      issuer,
      profile.id
    ], function(err, cred) {
      if (err) { return cb(err); }
      
      if (!cred) {
        // The account at the OpenID Provider (OP) has not logged in to this app
        // before.  Create a new user account and associate it with the account
        // at the OP.
        db.run('INSERT INTO users (name) VALUES (?)', [
          profile.displayName
        ], function(err) {
          if (err) { return cb(err); }
          
          var id = this.lastID;
          db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
            id,
            issuer,
            profile.id
          ], function(err) {
            if (err) { return cb(err); }
            var user = {
              id: id,
              name: profile.displayName
            };
            return cb(null, user);
          });
        });
      } else {
        // The account at the OpenID Provider (OP) has previously logged in to
        // the app.  Get the user account associated with the account at the OP
        // and log the user in.
        db.get('SELECT * FROM users WHERE id = ?', [ cred.user_id ], function(err, row) {
          if (err) { return cb(err); }
          if (!row) { return cb(null, false); }
          return cb(null, row);
        });
      }
    });
  }
));


// define routes
router.get('/',  (req, res) => {
    if (OAuthController.isLoggedIn(req)) {
        console.log("[DEBUG] Logged in")
        res.redirect('/users');
    } else {
        console.log("[DEBUG] Not logged in")
        res.render('index', {title: 'OIDC Test Application', signupEnabled: config.signupLink != "", signupLink: config.signupLink })
    }
});

//router.get('/login', oauthController.authorize);
router.get('/login', passport.authenticate('openidconnect'));
router.get('/logout', oauthController.logout)
//router.get('/auth/callback', oauthController.aznCallback);
router.get('/auth/callback',
    passport.authenticate('openidconnect', { failureRedirect: '/login', failureMessage: true }),
    function(req, res) {
      res.redirect('/');
    });

module.exports = router;