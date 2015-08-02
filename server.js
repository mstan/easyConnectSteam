//Packages & Deps
var path = require('path');
var express = require('express');
var ejs = require('ejs');
var bodyparser = require('body-parser');
var sqlite3 = require('sqlite3');

//Declare my deps
var directPass = require('./lib/direct.js');
var parserSteam = require('./lib/parser.js');
var getInfo = require('./lib/retrieve.js');
var serveIndex = require('./lib/index.js');
var deleteEntry = require('./lib/delete.js');
var viewEntries = require('./lib/viewEntries.js');

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

//Middleware
app.use(bodyparser.urlencoded({extended: false}));

//For deps to hook reqs
app.use(function (req,res,next) {
  req.db = db;
  next();
});


//GET index
app.get('/', serveIndex);

//GET "my link" by token
app.get('/go', getInfo);

//Accept index info
app.post('/', parserSteam);

//Pass directly to end user without them seeing info
app.get('/direct', directPass);

//View all results based on criteria of who created it
app.all('/myLinks', viewEntries);

//Remove entry from db
app.all('/delete', deleteEntry);

//Start on port 3000
app.listen(3000);