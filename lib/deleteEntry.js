/*****************************************
  A delete entry function. This function
  grabs the unique key from the page
  and the user from the user's cookie
  session. 

  The user session will be checked against
  who created the entry in the database.
  If they are the same person, issue
  the request. if they are different,
  this person is not the creator, and lacks
  authorization to delete this entry.
  Send a 403.

******************************************/



module.exports = function (req,res) {
  var uniqueKey = req.query.uniqueKey;
  var currentUser = req.user.id;

  //Query the database by the uniqueKey entry.
  req.db.get('SELECT * FROM links WHERE uniqueKey =?', uniqueKey, function (err,row) {


    //Retrieve the row. Now, check to see if this is the owner making the request.
  	if (currentUser == row.creator ) {
		   req.db.run('DELETE FROM links WHERE uniqueKey = ?', uniqueKey, function (err) {
		    res.redirect('/myLinks');
		  }); 		

  	} else {
    //This isn't our owner. They don't have permission to delete this.

		    res.sendStatus(403);
  	} // end else
  }); //end req.db.get
};