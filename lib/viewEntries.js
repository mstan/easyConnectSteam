/* ==========================================================================

   Take our currently logged in user, and then compare their ID with all the
   entries in the database that match them. Then list them all on the page
   so the user can easily view a neat collection of all of what they have
   made.

   Since this is reliant on us knowing the user, an authCheck is put into 
   place beause if the user isn't logged in and they tried viewing the server
   list, they aren't going to get anything. Unauthenticated users don't make
   entries.
   ============================================================================ */

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