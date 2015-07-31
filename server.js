//Packages & Deps
var path = require('path');
var express = require('express');
var ejs = require('ejs');
var bodyparser = require('body-parser');
var sqlite3 = require('sqlite3');
var randomstring = require("randomstring");
var validator = require('validator');

//My deps
var directPass = require('./lib/direct.js');
var parserSteam = require('./lib/parser.js');
var getInfo = require('./lib/retrieve.js');
//Let's start Express
var app = express();

//Let's body parse our document
app.use(bodyparser.urlencoded({extended: false}));

//Set View Engine
app.set('view engine', 'ejs');

//Set dir loading
app.use(express.static(__dirname + '/bower_components/bootstrap/dist/css'));
app.use(express.static(__dirname + '/views'));

//Let's initialize our database
dbFile = "./db/db.sqlite";
var db = new sqlite3.Database(dbFile);

//Middleware. Bind database to requests
app.get(function (req,res,next) {
  req.db = db;
  next();
});


//GET index
app.get('/', getInfo);

//Given the unique key, immediately redirect user to the steam:// protocol. This allows you to hide your information when giving it to others.
app.get('/direct', directPass);

//Accept index info
app.post('/', parserSteam);


//Start on port 3000
app.listen(3000);