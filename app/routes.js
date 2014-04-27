module.exports = function(app, passport) {
    // Index/login page
    app.get('/', isLoggedIn, function(req, res) {
        res.locals.loggedInUser = req.user.email;
        res.locals.loggedInUsername = req.user.username;
        res.render('dashboard');
    });

    // Sign up form
    app.get('/i-want-a-stack', function(req, res) {
        res.render('signup');
    });

    // New user!
    app.post('/wait-for-your-stack', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    }));

    // Login attempt
    app.post('/where-is-my-mind', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    }));

    // Logout
    app.get('/i-am-outta-here', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.render('login', {ignoreNavbar: true, message: req.flash('errorMessage')});
}