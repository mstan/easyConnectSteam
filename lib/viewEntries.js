module.exports = function (req,res) {

	  if (!req.user) {
    res.redirect('/?msg=You%20need%20to%20login!')
  }

	var currentUser = req.user.id; //TODO: change to current authenticated user

	console.log(currentUser);

  req.db.all('SELECT * FROM links WHERE creator = ?', currentUser, function (err,rows) {

    var results = rows;

    console.log(results); 	

    res.render('pages/results', {results: results});
  });
};