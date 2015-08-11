/* ==========================================================================

    parser is for accepting new entries from the index page. This system
    will take in information from the user, modify it accordingly, and
    then add system generated variables and pass all of this into
    the database.

    USER DEFINED VARIABLES:
    ipParts - Provided by the end user, port optional. In order to catch
    both cases of whether a port is provided, we always split the array
    at :. If there is no :, the array consists of one item, index 0
    (the base IP).

    If a port DOES exist, then ipParts[1] will be the user provided port.
    Otherwise, it is going to be null as it was not defined. In this
    case, we assume that we are going to use Valve's default port,
    or 27015.

    ipParts[0] is checked to see whether or not to see if it is a valid IPv4 address
    ipParts[1] is checked to see whether or not it is an integer


    password - password is provided in plaintext (as it would be on the server) 
    by our end user. For sake of simplicity (and convention to TF2 competitive
    password structure), we are only going to accept alphanumeric 
    characters.
  
    ***Because the password can be left blank, we have to do an if
    statement to see if password = "". "" will fail an alphanumeric
    check, but we want it to be able to pass.***

    password is checked to see whether it is alphanumeric (a-z,A-z,0-9)


    serverName - This is for our end user to identify which entry is which.
    This does not have any system utility value and is just for show.
    For sake of preventing malicious entries, SQL key chars are stripped
    from any passed name. 

    serverName is checked to see if it contains {}();. These are removed
    before entering the DB.



    SYSTEM DEFINED VARIABLES:

    createdOn - timestamp of when the entry was created

    uniqueKey - a random string identifier to make sifting through servers
    less predictable. This doesn't allow our user to cycle through entry
    by ID to ID connecting to multiple entries through a numerically 
    incremented set

    creator - grab the req.user.id and assign it to this entry. This way,
    we know who made it, and can do validity checks later when somebody
    tries to modify the entry.




   ============================================================================ */




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