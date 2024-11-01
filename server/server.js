// initialize libraries
const express = require('express');
const session = require('express-session')
const handlebars = require('express-handlebars');
const sessionRoutes = require('./routes/session-route');
const usersRoutes = require('./routes/users-route');
const config = require('./controllers/config').Config;
var fs = require('fs');
var https = require('https')
//require('https').globalAgent.options.rejectUnauthorized = false;
//https.globalAgent.options.rejectUnauthorized = false;
console.log("Config:")
console.log(config)
if(config.rejectUnauthorized == 'false') {
    console.log("Setting HTTPS to not reject Unauthorized ")
    https.globalAgent.options.rejectUnauthorized = false;
}
    

// initialize handlebars
var hbs = handlebars.create({
    helpers: {
        formatPurpose: function(purposeName, version) {
            if (purposeName == 'ibm-oauth-scope') {
                return 'OAuth Scope';
            }

            return `${purposeName} (Version ${version})`
        },
        formatDate: function (badDate) {
            var dMod = new Date(badDate * 1000);
            return dMod.toLocaleDateString();
        },
        formatState: function (state) {
            var stateOpt = {
                1: "Consent allow",
                2: "Consent deny",
                3: "Opt-in",
                4: "Opt-out",
                5: "Transparent"
            }
            return stateOpt[state];
        },
        formatAccessType: function (accessType) {
            if (accessType == "default") {
                return "";
            }
            return accessType;
        },
        formatAttribute: function (attribute) {
            if (attribute == "") {
                return "–";
            }
            else {
                return attribute;
            }
        }
    },
    layoutsDir: __dirname + '/../views/layouts',
    partialsDir: __dirname + '/../views/partials',
    extname: 'hbs',
    defaultLayout: 'default',
});

// initialize the app
const app = express();
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine)

app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true,
    cookie: { path: '/', maxAge: 120 * 1000, secure: false }
}))

// define routes
app.use(express.static(__dirname + '/../public'))
app.use('/', sessionRoutes);
app.use('/users', usersRoutes);

if (config.serverHttps) { 
    console.log(`Attempting to start app in secure mode.`)
    https.createServer({
        key: fs.readFileSync('./server.key'),
        cert: fs.readFileSync('./server.cert')
      }, app)
      .listen(config.serverPort, function() {
        console.log(`Example app listening on port ${config.serverPort}! Go to https://${config.fqdn}:${config.serverPort}/`)
      })
}
else {
    app.listen(config.serverPort, () => {
        console.log(`Example app listening on port ${config.serverPort}! Go to http://${config.fqdn}:${config.serverPort}/`)
    });
    
}


