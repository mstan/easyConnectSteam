module.exports = function (req,res) {
  var uniqueKey = req.query.uniqueKey;
  var currentUser = req.user.id;

  //Query the database by the uniqueKey entry.
  req.db.get('SELECT * FROM links WHERE uniqueKey =?', uniqueKey, function (err,row) {

  	if (currentUser == row.creator ) {
		   req.db.run('DELETE FROM links WHERE uniqueKey = ?', uniqueKey, function (err) {
		    res.redirect('/myLinks');
		  }); 		

  	} else {

		    res.sendStatus(403);
  	} // end else


  	//Make a promise out here


  }); //end req.db.get

  	//Check to see if the creator is the same as the person logged in

  		//If they are not, redirect them back to /myLinks

  		//If they are, delete the entry


};