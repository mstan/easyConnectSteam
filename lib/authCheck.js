/*****************************************
  Use authStatus function to check to see
  if our user is logged in. If they aren't,
  make them stop what they're doing and
  let them know they need to log in.

******************************************/

module.exports = function (req,res,next) {
    if (!req.user) {
      res.redirect('/?msg=You need to login first!' + '&msgStatus=0')
    }
    next();
};