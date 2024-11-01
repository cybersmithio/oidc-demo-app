// import dependencies and initialize the express router
const express = require('express');
const OAuthController = require('../controllers/oauth-controller');
const config = require('../controllers/config').Config;

const oauthController = new OAuthController(config.scope);
const router = express.Router();
var passport = require('passport');
var OpenIDConnectStrategy = require('passport-openidconnect');


passport.use(new OpenIDConnectStrategy({
    issuer: config.issuerUrl,
    authorizationURL: config.authnUrl,
    tokenURL: config.tokenUrl,
    userInfoURL: config.userInfoUrl,
    clientID: config.clientId,
    clientSecret: config.clientSecret,
    callbackURL: config.redirectUri
  },

  function verify(issuer, profile, accessToken, refreshToken, cb) {
    if( config.debug ) {
        console.log("Start of 'verify' function of OpenIDConnectStrategy")
    }
    console.log("Issuer info:")
    console.log(issuer)
    console.log("profile info:")
    console.log(profile)
    console.log("CB info:")
    console.log(cb)
    console.log("accessToken:")
    console.log(accessToken)
    console.log("refreshToken:")
    console.log(refreshToken)
    
    return cb(null, {id: profile.id, name: profile.displayName, refreshToken: refreshToken});
  }



));


passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

// define routes
router.get('/',  (req, res) => {


    // Check for req.session.passport.user.id
    if ( req.session != undefined && req.session.passport != undefined && req.session.passport.user != undefined && req.session.passport.user.id != undefined ) {
        console.log("[DEBUG] Logged In")
        console.log("[DEBUG] User ID: " +JSON.stringify(req.session.passport.user.id))
        console.log("[DEBUG] Session Info: " +JSON.stringify(req.session))

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
        passport.authenticate('openidconnect', { failureRedirect: '/error', failureMessage: true }),
        function(req, res) {
            console.log("Callback redirecting to /")
            console.log("[DEBUG] Req: ")
            console.log(req.user)

        res.redirect('/');
        }
);


module.exports = router;