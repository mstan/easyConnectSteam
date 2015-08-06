//List all entries by our currently logged in user

module.exports = function (req,res) {

  //Grab our currently identified user
  var currentUser = req.user.id;

  //Grab all entries made by our user
  req.db.all('SELECT * FROM links WHERE creator = ?', currentUser, function (err,rows) {

    var results = rows;

    //Pass results to our results page
    res.render('pages/results', {results: results});
  });
};