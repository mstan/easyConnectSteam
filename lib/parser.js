var validator = require('validator');
var randomstring = require("randomstring");

module.exports = function (req,res) {
//User Defined Vars
  var ipParts = req.body.ip.split(":");
  var password = req.body.password; 

//Was that IP REALLY an IP?
  if ( !validator.isIP(ipParts[0], 4) ) {
    res.redirect('/?msg=Invalid%20IP%20address!');
    return;
  }  

  //We aren't sure about the port. Let's break this up, just in case
  //ipParts[0] is always base IP
  //ipParts [1] is port if provided. Otherwise assume Source Engine default 27015
  var ip = ipParts[0];
  var port = ipParts[1] || 27015;

  //TODO: Create a function that checks all entries for any that match BOTH IP and port. if so. Don't add another entry to this database. Fail instead because entry exists. Pass direct link?

  //Server Defined Vars
  var createdOn = new Date().getTime() / 1000 >> 0; //Time in milliseconds. Let's convert this to seconds by /1000. SRL to convert this from float to int.
  var uniqueKey = randomstring.generate(7);
  var creator = "unregistered"; //TODO: Later redefine to current authenticated user.

//Here's all of our variables for the database. Put them into one neat little array
  var pass_to_db = [ip, port, password, uniqueKey, createdOn, creator];

  req.db.run("INSERT INTO links (ip,port,password,uniqueKey,createdOn,creator) VALUES(?,?,?,?,?,?)", pass_to_db, function (err) {

//Build URL to give to the user
    var fullLink = "steam://connect/" + ip + ":" + port + "/" + password;

    res.render('pages/index', {output: fullLink, permalink: uniqueKey, msg: null});
  });
};