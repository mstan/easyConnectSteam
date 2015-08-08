/******************* 
* Packages & Deps  *
*******************/


  //Modules
var path = require('path');
var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');

  //Passport

var steamStrategyConfiguration = require('./lib/steamStrategy'); //listed under .gitignore due to sensitive access token.

  //Declare my deps
var directPass = require('./lib/direct.js');
var parserSteam = require('./lib/parser.js');
var getInfo = require('./lib/retrieve.js');
var serveIndex = require('./lib/index.js');
var deleteEntry = require('./lib/delete.js');
var viewEntries = require('./lib/viewEntries.js');
var authCheck = require('./lib/authCheck.js');
var updateEntry = require('./lib/updateEntry.js');
var logout = require('./lib/logout.js');
var globalTokens = require('./lib/globalTokens.js');

//Global declaration of var for cross-module use
global.sqlBlacklist = '{}();';


//Let's start Express
var app = express();

//Set View Engine
app.set('view engine', 'ejs');

//Set dir loading
app.use(express.static(__dirname + '/bower_components/bootstrap/dist/css'));
app.use(express.static(__dirname + '/views'));

//Let's initialize our database
dbFile = "./db/db.sqlite";
var db = new sqlite3.Database(dbFile);

/******************* 
*    Middleware    *
*******************/

  //For deps to hook reqs
app.use(function (req,res,next) {
  req.db = db;
  next();
});
 
  //Misc
app.use(session({secret: 'secret token', resave: true, saveUninitialized: true}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('super secret token'));
app.use(passport.initialize());
app.use(passport.session());

  //Global tokens to pass to our end user by res.locals
app.use(globalTokens);



/******************* 
*  Passport & Auth *
*******************/

  //Passport

  //Middleware for Steam auth  
app.get('/auth/steam',
  passport.authenticate('steam')); //No function is passed here. passport.auth takes care of it.

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/?msg=Login%20Failed' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/?msg=Logged%20in!&msgStatus=3');
  });
 
app.get('/logout', logout);


  //Passpot strategies & configuration
passport.use(steamStrategyConfiguration);

passport.serializeUser(function (user, done) {
  done(null, user);
}); 
 
passport.deserializeUser(function (user, done) {
  done(null, user);
});


/******************* 
*    Routing       *
*******************/

//GET index
app.get('/', serveIndex);

//Accept index info
app.post('/', authCheck, parserSteam);

//GET "my link" by token
app.get('/go', authCheck, getInfo);

//GET "my link" by token
app.post('/update', updateEntry); // end app.get

//Pass directly to end user without them seeing info
app.get('/direct', directPass);

//View all results based on criteria of who created it
app.all('/myLinks', authCheck, viewEntries);

//Remove entry from db
app.all('/delete', authCheck, deleteEntry);


//Start on port 3000
app.listen(3000);