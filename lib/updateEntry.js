var validator = require('validator');

module.exports = function (req,res) {
  //Read in the server name. Drop any blacklisted characters
  var serverName = validator.blacklist(req.body.serverName, sqlBlacklist)

  //The entry's uniqueKey. Read is as read only. Likely doesn't need sanitized
  var uniqueKey = req.body.uniqueKey;

  //Break up IP to handle it
  var ipParts = req.body.ip.split(":");
  var ip = ipParts[0];
  var port = ipParts[1] || 27015;

  //Take in password
  var password = req.body.password;


  //Now that IP is broken up, check the first part. Is it really an IP?
  //What about the port? Is that just an integer value?
  if ( !validator.isIP(ipParts[0], 4) || !validator.isInt(port) ) {
    res.redirect('/go?msg=Invalid IP' + '&msgStatus=0' + '&uniqueKey=' + uniqueKey);
    return;
  }

  //We don't require a password. It can be blank. If it isn't? Let's check it.
  if (password != "") {
      //TF2 passwords should really only be numbers and letters. No special characters. If it is, their problem, not ours. Reject it
      if ( !validator.isAlphanumeric(password) ) {
          res.redirect('/go?msg=Invalid Password' + '&msgStatus=0' + '&uniqueKey=' + uniqueKey);
          return; 
      }  
  }

  //Bundle up our variables. Pass them to the DB
  var passToDB = [ip,port,password,serverName,uniqueKey];


  //Check to see if the user issuing this request is the creator of it. If they aren't, 403 it.
  if (req.user.id !== req.body.creator) {
  	res.send(403);
  } else {

      req.db.run("UPDATE links SET ip=?, port=?, password=?, serverName=? WHERE uniqueKey=?", passToDB, function (err) { 
      }); // end db.run    

  }

  //Send our user back.
  res.redirect('/go?msg=Updated!' + '&msgStatus=3' + '&uniqueKey=' + uniqueKey);
};