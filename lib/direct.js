//Given the unique key, immediately redirect user to the steam:// protocol. This allows you to hide your information when giving it to others.
module.exports = function (req,res) {
  //Assign key from query
  var uniqueKey = req.query.uniqueKey;

  //Look it up in the db
  req.db.get('SELECT * FROM links WHERE uniqueKey = ?', uniqueKey, function (err, row) {
    //Does it exist?
    if(!row) { 
      res.send("Entry not found");
    } else {
      //It does? Let's give them their link back.
      var fullLink = "steam://connect/" + row.ip + ":" + row.port + "/" + row.password;

      res.redirect(fullLink);
    }
  });
};