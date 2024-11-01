const config = require('./config').Config;

const OAuthContext = require('ibm-verify-sdk').OAuthContext;

class OAuthController {

    constructor(scope) {
        this._authClient = new OAuthContext({
            tenantUrl    : config.tenantUrl,
            clientId     : config.clientId,
            clientSecret : config.clientSecret,
            redirectUri  : config.redirectUri,
            responseType : 'code',
            flowType     : 'authorization',
            scope        : scope
        });
    }

    authorize = (req, res, scope) => {
        this._authClient.authenticate().then(url => {
            res.redirect(url);
        }).catch(error => {
            res.send(error);
        })
    }

    aznCallback = (req, res) => {
        console.log("Request info: " + JSON.stringify(req));
        this._authClient.getToken(req.url).then(token => {
    
            console.log("Got token - " + JSON.stringify(token));
            
            req.session.authToken = token;
            req.session.token = token;
            req.session.save();
    
            // Extract redirect URL from querystring
            let targetUrl = req.session.targetUrl;
            if (!targetUrl || targetUrl == "") {
                targetUrl = "/";
            }
    
            // redirect to authenticated page
            res.redirect(targetUrl);
        }).catch(error => {
            res.send("ERROR: " + error);
        });
    }

    logout = (req, res) => {

        if (!OAuthController.isLoggedIn(req)) {
            res.redirect('/')
            return;
        }

        let authToken = OAuthController.getAuthToken(req);
        this._authClient.revokeToken(authToken, 'access_token').then(response => {

        }).catch(error => {
            console.log(error);
        })
        
        // revoking the refresh_token
        this._authClient.revokeToken(authToken, 'refresh_token').then(response => {
        
        }).catch(error => {
            console.log(error);
        })

        req.session.destroy();
        const proxyHost = req.headers["x-forwarded-host"];
        const host = proxyHost ? proxyHost : req.headers.host;
        res.redirect(config.tenantUrl + '/idaas/mtfim/sps/idaas/logout?redirectUrl=' + encodeURIComponent(req.protocol + '://' + host) + "&themeId=" + config.themeId);
    }

    static isLoggedIn(req) {
        console.log("Checking if user is logged in...");
        
        return req.session != undefined && req.session.passport != undefined && req.session.passport.user != undefined && req.session.passport.user.id != undefined && req.session.passport.user.id != "";
    }

    static getAuthToken = (req) => {
        if (req.session != undefined && req.session.passport != undefined && req.session.passport.user != undefined && req.session.passport.user.refreshToken != undefined && req.session.passport.user.refreshToken != "") {
            return req.session.passport.user.refreshToken
        }
    
        return null;
    }
}

module.exports = OAuthController;