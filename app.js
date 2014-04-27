/*
   __    __     __     __   __     _____     ______     ______   ______     ______     __  __    
  /\ "-./  \   /\ \   /\ "-.\ \   /\  __-.  /\  ___\   /\__  _\ /\  __ \   /\  ___\   /\ \/ /    
  \ \ \-./\ \  \ \ \  \ \ \-.  \  \ \ \/\ \ \ \___  \  \/_/\ \/ \ \  __ \  \ \ \____  \ \  _"-.  
   \ \_\ \ \_\  \ \_\  \ \_\\"\_\  \ \____-  \/\_____\    \ \_\  \ \_\ \_\  \ \_____\  \ \_\ \_\ 
    \/_/  \/_/   \/_/   \/_/ \/_/   \/____/   \/_____/     \/_/   \/_/\/_/   \/_____/   \/_/\/_/ 

  By Jaewoong Hwang (http://jaewoong.info)
   April 2014
*/


// Setup
var express         = require('express');
var app             = express();
var port            = process.env.PORT || 4444;
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var session         = require('express-session');
var passport        = require('passport');
var flash           = require('connect-flash');
var expressHbs      = require('express3-handlebars');
var mongoose        = require('mongoose');
var MongoStore      = require('connect-mongo')(session);

var configDB        = require('./config/database.js');


// Configurations
mongoose.connect(configDB.url);

// Parsers
app.use(bodyParser());
app.use(cookieParser());

/* To make 'session' work in express 4.x, I needed to change connect-mongo.js.
   Line 30: var Store = connect.Store || connect.session.Store;
   Reference: https://github.com/mrzepinski/connect-mongo/commit/21359889c4c5b81db85183a7e0549500160cedf2 */

// Passport
app.use(session({
    store: new MongoStore({
        db: mongoose.connection.db,
        collection: 'sessions'
    }),
    secret: 'very-secret-such-confidential-so-covered'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./config/passport.js')(passport);

// Template engine
hbs = expressHbs.create({
    defaultLayout: 'main',
    extname:       '.html',
    layoutsDir:    'views/layouts/',
    partialsDir:   'views/partials'
});
app.engine('html', hbs.engine);
app.set('view engine', 'html');

// Routes
require('./app/routes.js')(app, passport);
// Static pages
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Launch
app.listen(port);
console.log('Launched on port %d', port);