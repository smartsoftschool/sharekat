module.exports = function (app) {
    var sessions = require('client-sessions');
    var csrf = require('csurf');

    // app.use(csrf())

    // error handler


    app.auth = {
        loginRequired: loginRequired,
        login: login,
        logout: logout,
        isAdmin: isAdmin,
    };


    app.use(sessions({
        cookieName: 'session', // cookie name dictates the key name added to the request object
        secret: 'amjvgsrdihgvnrdoigydrsnghervburdhg', // should be a large unguessable string
        duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
        activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
    }));

    //==============middlewares==============
    app.use(function (req, res, next) {
        if (req.session && req.session.user) {
            var id = req.session.user.id;
            app.db.User.findById(id, function (err, result) {
                if (err) { next(); }
                req.user = result;
                next();
            });
        } else {
            next();
        }
    })


    function isAdmin(req, res, next) {
        if (req.user) {
            if (user.isAdmin) {
                next();
            }
        }
        req.session.returnUrl = req.url;
        res.redirect('/login');
    }

    function loginRequired(req, res, next) {

        if (req.user) {
            next();
        } else {
            req.session.returnurl = req.url;
            res.redirect('/user/login');
        };
    };

    function login(req, res, next) {
        var model = req.body;

        app.db.User.findOne({ "email": model.email }, function (err, user) {

            if (user && app.bcrypt.compareSync(model.pass, user.pass)) {
                if (user.verf == null) {
                    req.session.user = {
                        id: user._id
                    };
                    next();
                } else {
                    res.render('user/mail-views/pleaseactivate', { entityId: user._id })
                }

            } else {
                res.render('user/login', { msg: 'كلمه المرور او البريد الالكتروني غير صحيح' })
            }
        });
    }

    function logout(req, res, next) {
        req.session.reset();
        next();
    }

}