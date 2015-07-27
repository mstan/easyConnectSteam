//Packages & Deps
var path = require('path');
var express = require('express');
var ejs = require('ejs');
var bodyparser = require('body-parser');

//Let's start Express
var app = express();

//Let body parser parse our document
app.use(bodyparser.urlencoded({extended: false}));

//Set View Engine
app.set('view engine', 'ejs');

//Set dir loading
app.use(express.static(__dirname + '/bower_components/bootstrap/dist/css'));
app.use(express.static(__dirname + '/views'));


//GET index
app.get('/', function (req,res) {
	res.render('pages/index', {output: null});
});

//Accept index info
app.post('/', function (req,res) {

	//ip_parts[0] is always base IP
	//ip_parts [1] is port if provided. Otherwise 27015
	var ip_parts = req.body.ip.split(":");

	var ip = ip_parts[0]
	var port = ip_parts[1] || 27015;

	var full_link_out = "steam://connect/" + ip + ":" + port + "/" + req.body.password;

	res.render('pages/index', {output: full_link_out});
});









app.listen(3000);