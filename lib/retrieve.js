module.exports = function (req,res) {
  //Assign key from query
  var uniqueKey = req.query.uniqueKey;

  //Look it up in the db
  req.db.get('SELECT * FROM links WHERE uniqueKey = ?', uniqueKey, function (err, row) {
      //Does it exist?
      if(!row) { 
           res.send("Entry not found");
      //It does? make sure they're the right user. If so, give them their link back           
      } else if (req.user.id == row.creator) {

          var fullLink = "steam://connect/" + row.ip + ":" + row.port + "/" + row.password;
          var serverName = row.serverName;

          res.render('pages/go', {output: fullLink, uniqueKey: uniqueKey, row: row });
       } else {
          res.send(403);
       } 

  });
};