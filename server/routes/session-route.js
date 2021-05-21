// import dependencies and initialize the express router
const express = require('express');
const OAuthController = require('../controllers/oauth-controller');
const oauthController = new OAuthController('openid email profile');

const router = express.Router();

// define routes
router.get('/',  (req, res) => {
    if (OAuthController.isLoggedIn(req)) {
        console.log("[DEBUG] Logged in")
        res.redirect('/users');
    } else {
        console.log("[DEBUG] Not logged in")
        res.render('index', {title: 'Verify OIDC Demo' })
    }
});

router.get('/login', oauthController.authorize);
router.get('/logout', oauthController.logout)
router.get('/auth/callback', oauthController.aznCallback);

module.exports = router;