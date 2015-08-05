module.exports = function (req,res) {

	var currentUser = req.user.id;

	console.log(currentUser);

  req.db.all('SELECT * FROM links WHERE creator = ?', currentUser, function (err,rows) {

    var results = rows;

    console.log(results); 	

    res.render('pages/results', {results: results});
  });
};