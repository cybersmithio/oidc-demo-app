const jwt = require('jsonwebtoken')
const OAuthController = require('./oauth-controller');
const DPCM = require('verify-dpcm-sdk-js');
const config = require('./config').Config;

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

    getConsents = (req, res) => {
        if (!OAuthController.isLoggedIn(req)) {
            res.redirect('/');
            return;
        }

        let idTokenPayload = this.getUserPayload(req);
        let auth = {
            accessToken: OAuthController.getAuthToken(req).access_token
        }

        let dpcmClient = new DPCM(config, {})
        dpcmClient.getUserConsents(auth).then(result => {
            res.render('consents', { user: idTokenPayload, consents: result.response.consents, title: 'My Consents' });
        }).catch(err => {
            console.log("Error=" + err);
            res.render('consents', { user: idTokenPayload, consents: null, title: 'No consents found' });
        })
    }
}

module.exports = UsersController;