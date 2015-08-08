module.exports = function (req,res,next) {
	//Hand off local user. For Auth and log in status
  res.locals.user = req.user;
  //Message to pass off to each page. Either be a message or be null to avoid ejs from throwing unidentified
  res.locals.msg = req.query.msg || null;
  //Message status. For the if/elses and figuring out which box to display from Bootstrap;
  res.locals.msgStatus = req.query.msgStatus || null;

  //AuthStatus. Is our user logged in? Some actions we don't want unlogged uesrs taking.
  var authStatus = 0;
    if(req.user) {
      authStatus = 1;
    }    
  res.locals.authStatus = authStatus;  
  //console.log('User authentication status is: ' + authStatus);

  next();
};