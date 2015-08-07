//Middleware to pass a boolean on whether or not our user is logged in

module.exports = function (req,res,next) {
  var authStatus = 0;
    if(req.user) {
      authStatus = 1;
    }
  //console.log('User authentication status is: ' + authStatus);
  global.authStatus = authStatus;
  next();
};