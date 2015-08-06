module.exports = function (req,res) {
  var serverName = req.body.serverName;
  var uniqueKey = req.body.uniqueKey;

  var ipParts = req.body.ip.split(":");  
  var ip = ipParts[0];
  var port = ipParts[1] || 27015;
  var password = req.body.password || "";

  var passToDB = [ip,port,password,serverName,uniqueKey];

  //Permission check
  console.log(req.user.id);
  console.log(req.body.creator);


  //Check to see if the user issuing this request is the creator of it.
  if (req.user.id !== req.body.creator) {
  	res.send(403);
  }


  req.db.run("UPDATE links SET ip=?, port=?, password=?, serverName=? WHERE uniqueKey=?", passToDB, function (err) {
    
  }); // end db.run

  res.redirect('/go?uniqueKey=' + uniqueKey);
};