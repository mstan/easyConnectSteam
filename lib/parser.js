module.exports = function (req,res) {
//User Defined Vars
  var ipParts = req.body.ip.split(":");
  var password = req.body.password; 

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

//Here's all of our variables for the database. Put them into one neat little package
  var pass_to_db = [ip, port, password, uniqueKey, createdOn];

  db.run("INSERT INTO links (ip,port,password,uniqueKey,createdOn) VALUES(?,?,?,?,?)", pass_to_db, function (err) {

//Build our URL to give to the user
    var fullLink = "steam://connect/" + ip + ":" + port + "/" + password;

    res.render('pages/index', {output: fullLink, permalink: uniqueKey, msg: null});
  });
};