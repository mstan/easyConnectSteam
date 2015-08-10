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