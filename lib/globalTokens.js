module.exports = function (req,res,next) {
  res.locals.user = req.user;
  res.locals.msg = req.query.msg || null;
  res.locals.msgStatus = req.query.msgStatus || null;
  next();
};