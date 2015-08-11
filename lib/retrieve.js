/* ==========================================================================

   Retrieve an entry based on it's uniqueKey. We used uniqueKey and not ID
   as ID would be predictable for users to sift through and try to hit random
   entries.

   This page allows our end user to modify his entry, and view all the information
   about it, including IP and password. Since we want to try and keep this server
   info out of the public eye, there is an auth check to see if our end user
   is the creator. If this person is not the creator, we don't want them viewing
   or trying to update it, thus we 403.
   ============================================================================ */



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