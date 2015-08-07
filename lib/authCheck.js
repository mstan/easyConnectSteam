//Is our user authenticated?
  //We don't want unregistered users claiming IPs
  //We won't let our user view "My Servers" if they aren't logged in.
module.exports = function (req,res,next) {
    if (!req.user) {
      res.redirect('/?msg=You%20need%20to%20login%20first!&msgStatus=0')
    }
    next();
};