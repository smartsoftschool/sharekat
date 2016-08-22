module.exports = function (app) {
    var sessions = require('client-sessions');
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
            var email = req.session.user.email;
            var user = app.dbLayer.db.users.find(function (x) {
                return x.email == email;
            });
            req.user =user;
        }
        next();
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

        var user = app.dbLayer.db.users.find(function (x) {
            return x.email == model.email;
        });
        if (user && user.pass == model.pass) {
            if( user.verf == true){
                req.session.user = {
                email: user.email
            };
            } else {
                res.render('user/pleaseactivate', { entityId: user.id })
            }
            
        }else {
            res.render('user/pleaseactivate', { entityId: user.id })
        }
        next();
    }
    function logout(req, res, next) {
        req.session.reset();
        next();
    }
    
}