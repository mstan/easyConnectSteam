module.exports = function (req,res) {
	var uniqueKey = req.query.uniqueKey;

  req.db.run('DELETE FROM links WHERE uniqueKey = ?', uniqueKey, function (err) {
    res.redirect('/myLinks');
  });
};