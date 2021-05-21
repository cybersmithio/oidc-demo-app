const jwt = require('jsonwebtoken')
const OAuthController = require('./oauth-controller');

class UsersController {

    constructor() {}

    getUserPayload = (req) => {
        let authToken = OAuthController.getAuthToken(req);
        let decoded = jwt.decode(authToken.id_token);
        return decoded;
    }

    getUsersIndex = (req, res) => {
        if (!OAuthController.isLoggedIn(req)) {
            res.redirect('/');
            return null;
        }

        res.render('users', { user: this.getUserPayload(req), title: 'User Main' });
    }

    getProfile = (req, res) => {
        if (!OAuthController.isLoggedIn(req)) {
            res.redirect('/');
            return;
        }

        let idTokenPayload = this.getUserPayload(req);
        res.render('profile', { user: idTokenPayload, fullJson: JSON.stringify(idTokenPayload, null, 4), title: 'Profile Information' });
    }
}

module.exports = UsersController;