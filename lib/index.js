module.exports = function (req,res) {
  var msg = req.query.msg || null;

  res.render('pages/index', {output: null, msg: msg});
};