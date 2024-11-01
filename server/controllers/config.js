// load contents of .env into process.env
require('dotenv').config();

exports.Config = {
    tenantUrl    : process.env.TENANT_URL,
    issuerUrl    : process.env.ISSUER_URL,
    authnUrl     : process.env.AUTHORIZATION_URL,
    tokenUrl     : process.env.TOKEN_URL,
    userInfoUrl  : process.env.USERINFO_URL,
    clientId     : process.env.CLIENT_ID,
    clientSecret : process.env.CLIENT_SECRET,
    redirectUri  : process.env.REDIRECT_URI,
    scope        : process.env.SCOPE,
    signupLink   : process.env.USER_REGISTRATION_LINK,
    themeId      : process.env.THEME_ID,
    serverHttps  : process.env.SERVER_HTTPS,
    serverPort   : process.env.SERVER_PORT,
    fqdn         : process.env.FQDN,
    debug        : process.env.DEBUG,
    rejectUnauthorized : process.env.REJECT_UNAUTHORIZED,
};