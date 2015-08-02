module.exports = function (req,res) {

	var currentUser = 'unregistered'; //TODO: change to current authenticated user

	console.log(currentUser);

  req.db.all('SELECT * FROM links WHERE creator = ?', currentUser, function (err,rows) {

    var results = rows;

    console.log(results); 	

    res.render('pages/results', {results: results});
  });
};