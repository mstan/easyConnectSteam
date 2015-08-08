//Is our user authenticated?
  //We don't want unregistered users claiming IPs
  //We won't let our user view "My Servers" if they aren't logged in.
module.exports = function (req,res,next) {
    if (!req.user) {
      res.redirect('/?msg=You need to login first!' + '&msgStatus=0')
    }
    next();
};