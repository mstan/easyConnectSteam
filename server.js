//Packages & Deps
var path = require('path');
var express = require('express');
var ejs = require('ejs');
var bodyparser = require('body-parser');
var sqlite3 = require('sqlite3');
var randomstring = require("randomstring");

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
	res.render('pages/index', {output: null});
});

//Accept index info
app.post('/', function (req,res) {

//User Defined Vars
	var ip_parts = req.body.ip.split(":");
	var password = req.body.password;	

	//ip_parts[0] is always base IP
	//ip_parts [1] is port if provided. Otherwise 27015	
	var ip = ip_parts[0];
	var port = ip_parts[1] || 27015;

//Server Defined Vars
	var created_on = new Date().getTime() / 1000 >> 0; //in ms. convert to s. bit shift to drop float val.
	var unique_key = randomstring.generate(7);

	var pass_to_db = [ip, port, password, unique_key, created_on];

	db.run("INSERT INTO links (ip,port,password,unique_key,created_on) VALUES(?,?,?,?,?)", pass_to_db, function (err) {

		var full_link_out = "steam://connect/" + ip + ":" + port + "/" + password;

		res.render('pages/index', {output: full_link_out, permalink: unique_key});
	});
});

//GET "my link" by token
app.get('/go', function (req,res) {
	//Assign key from query
	var unique_key = req.query.unique_key;

	//Look it up in the db
	db.get('SELECT * FROM links WHERE unique_key = ?', unique_key, function (err, row) {
		//Does it exist?
		if(!row) { 
			res.send("Entry not found");
		} else {
		//It does? Let's give them their link back.
			var full_link_out = "steam://connect/" + row.ip + ":" + row.port + "/" + row.password;

			res.render('pages/go', {output: full_link_out});
	}
	});
});

app.listen(3000);