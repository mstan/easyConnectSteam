var validator = require('validator');
var randomstring = require("randomstring");

module.exports = function (req,res) {
//User Defined Vars
  //We aren't sure about the port. Let's break this up, just in case
  //ipParts[0] is always base IP
  //ipParts [1] is port if provided. Otherwise assume Source Engine default 27015
  var password = req.body.password; 
  var serverName = validator.blacklist(req.body.serverName, sqlBlacklist);

  var ipParts = req.body.ip.split(":");
  var ip = ipParts[0];
  var port = ipParts[1] || 27015;


//Was that IP REALLY an IP? Let's also check our port.
  if ( !validator.isIP(ipParts[0], 4) || !validator.isInt(port) ) {
    res.redirect('/?msg=Invalid IP Address' + '&msgStatus=0');
    return;
  }  

//If our password isnt blank, let's make sure it only has letters and numbers.
  if (password != "") {
      if ( !validator.isAlphanumeric(password) ) {
          res.redirect('/msg=Invalid Password' + '&msgStatus=0');
          return; 
      }  
  }


  //We don't want duplicate entries. Query the database for any entry where both the IP AND port are the same.
  var hostAndPort = [ip, port];

  //Does that entry already exist?
  req.db.get('SELECT * FROM links WHERE ip = ? AND port = ?', hostAndPort, function (err,row) {
      //If it exists, tell our user about it.
      if(row) {
        res.render('pages/index', {msg: 'That entry already exists', output: null } );
      //We didn't find it. Let's go ahead and add it.
      } else {
          //Server Defined Vars
          var createdOn = new Date().getTime() / 1000 >> 0; //Time in milliseconds. Let's convert this to seconds by /1000. SRL to convert this from float to int.
          var uniqueKey = randomstring.generate(7); //Unique identifier
          var creator = req.user.id; //Our current authenticated user

          //Here's all of our variables for the database. Put them into one neat little array
          var passToDB = [ip, port, password, uniqueKey, createdOn, creator, serverName];

          req.db.run("INSERT INTO links (ip,port,password,uniqueKey,createdOn,creator,serverName) VALUES(?,?,?,?,?,?,?)", passToDB, function (err) {

            //Build URL to give to the user
            var fullLink = "steam://connect/" + ip + ":" + port + "/" + password;

            res.render('pages/index', {output: fullLink, permalink: uniqueKey});
          });      

      } //End else
  }); //End req.db.get
};