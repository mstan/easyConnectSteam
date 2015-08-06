var validator = require('validator');
var randomstring = require("randomstring");

module.exports = function (req,res) {
//User Defined Vars
  var ipParts = req.body.ip.split(":");
  var password = req.body.password; 
  var serverName = validator.blacklist(req.body.serverName, sqlBlacklist);

  var ip = ipParts[0];
  var port = ipParts[1] || 27015;


//Was that IP REALLY an IP? Let's also check our port.
  if ( !validator.isIP(ipParts[0], 4) || !validator.isInt(port) ) {
    res.redirect('/?msg=Invalid%20IP%20address!');
    return;
  }  

//If our password isnt blank, let's make sure it only has letters and numbers.
  if (password != "") {
      if ( !validator.isAlphanumeric(password) ) {
          res.redirect('/go?msg=Invalid%20Password&uniqueKey=' + uniqueKey);
          return; 
      }  
  }

  //We aren't sure about the port. Let's break this up, just in case
  //ipParts[0] is always base IP
  //ipParts [1] is port if provided. Otherwise assume Source Engine default 27015


  var duplicateCheck = [ip, port];

  //Does that entry already exist?
  req.db.get('SELECT * FROM links WHERE ip = ? AND port = ?', duplicateCheck, function (err,row) {
      if(row) {
        res.render('pages/index', {msg: 'That entry already exists at: http://localhost:3000/go?uniqueKey=' + row.uniqueKey, output: null } );
      } else { //We didn't find it. So probably not
          //Server Defined Vars
          var createdOn = new Date().getTime() / 1000 >> 0; //Time in milliseconds. Let's convert this to seconds by /1000. SRL to convert this from float to int.
          var uniqueKey = randomstring.generate(7);
          var creator = req.user.id || "unregistered"; //TODO: Later redefine to current authenticated user.

        //Here's all of our variables for the database. Put them into one neat little array
          var passToDB = [ip, port, password, uniqueKey, createdOn, creator, serverName];

          req.db.run("INSERT INTO links (ip,port,password,uniqueKey,createdOn,creator,serverName) VALUES(?,?,?,?,?,?,?)", passToDB, function (err) {

        //Build URL to give to the user
            var fullLink = "steam://connect/" + ip + ":" + port + "/" + password;

            res.render('pages/index', {output: fullLink, permalink: uniqueKey, msg: null});
          });      

      } //End else
  }); //End req.db.get
};