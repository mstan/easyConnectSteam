var validator = require('validator');

module.exports = function (req,res) {
  var serverName = validator.blacklist(req.body.serverName, sqlBlacklist)
  var uniqueKey = req.body.uniqueKey;

  var ipParts = req.body.ip.split(":");
  var ip = ipParts[0];
  var port = ipParts[1] || 27015;
  var password = req.body.password;

  var msg = req.query.msg || null;




  if ( !validator.isIP(ipParts[0], 4) || !validator.isInt(port) ) {
    res.redirect('/go?msg=Invalid%20IP&uniqueKey=' + uniqueKey);
    return;
  }

  if (password != "") {
      if ( !validator.isAlphanumeric(password) ) {
          res.redirect('/go?msg=Invalid%20Password&uniqueKey=' + uniqueKey);
          return; 
      }  
  }

  var passToDB = [ip,port,password,serverName,uniqueKey];


  //Check to see if the user issuing this request is the creator of it.
  if (req.user.id !== req.body.creator) {
  	res.send(403);
  }


  req.db.run("UPDATE links SET ip=?, port=?, password=?, serverName=? WHERE uniqueKey=?", passToDB, function (err) {
    
  }); // end db.run

  res.redirect('/go?uniqueKey=' + uniqueKey);
};