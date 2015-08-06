module.exports = function (req,res,next) {
		if (!req.user) {
			res.redirect('/?msg=You%20need%20to%20login%20first!')
		}
		next();
};