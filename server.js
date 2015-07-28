//Packages & Deps
var path = require('path');
var express = require('express');
var ejs = require('ejs');
var bodyparser = require('body-parser');
var sqlite3 = require('sqlite3');
var randomstring = require("randomstring");
var validator = require('validator');

//Let's start Express
var app = express();

//Let body parse our document
app.use(bodyparser.urlencoded({extended: false}));

//Set View Engine
app.set('view engine', 'ejs');

//Set dir loading
app.use(express.static(__dirname + '/bower_components/bootstrap/dist/css'));
app.use(express.static(__dirname + '/views'));

//Let's initialize our database
db_file = "./db/db.sqlite";
var db = new sqlite3.Database(db_file);


//GET index
app.get('/', function (req,res) {
  var msg = req.query.msg || null;


	res.render('pages/index', {output: null, msg: msg});
});

//Accept index info
app.post('/', function (req,res) {

//User Defined Vars
  var ipParts = req.body.ip.split(":");
  var password = req.body.password;	

console.log( validator.isIP(ipParts, 4) );

//Was that IP REALLY an IP?
if ( !validator.isIP(ipParts[0], 4) ) {
	res.redirect('/?msg=Invalid%20IP%20address!');
	return;
}  

  //ipParts[0] is always base IP
  //ipParts [1] is port if provided. Otherwise 27015	
  var ip = ipParts[0];
  var port = ipParts[1] || 27015;

//Server Defined Vars
  var createdOn = new Date().getTime() / 1000 >> 0; //in ms. convert to s. bit shift to drop float val.
  var uniqueKey = randomstring.generate(7);

  var pass_to_db = [ip, port, password, uniqueKey, createdOn];

  db.run("INSERT INTO links (ip,port,password,uniqueKey,createdOn) VALUES(?,?,?,?,?)", pass_to_db, function (err) {

    var fullLink = "steam://connect/" + ip + ":" + port + "/" + password;

    res.render('pages/index', {output: fullLink, permalink: uniqueKey, msg: null});
  });
});

//GET "my link" by token
app.get('/go', function (req,res) {
  //Assign key from query
  var uniqueKey = req.query.uniqueKey;

  //Look it up in the db
  db.get('SELECT * FROM links WHERE uniqueKey = ?', uniqueKey, function (err, row) {
    //Does it exist?
    if(!row) { 
      res.send("Entry not found");
      } else {
      //It does? Let's give them their link back.
      var fullLink = "steam://connect/" + row.ip + ":" + row.port + "/" + row.password;

      res.render('pages/go', {output: fullLink});
  }
  });
});





//test func for db output
app.get('/db', function (req,res) {
    db.all('SELECT * FROM links', function (err, rows) {
        res.render('pages/db', { entries: rows });
    });
});


app.listen(3000);