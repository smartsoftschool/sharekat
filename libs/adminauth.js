module.exports = function (app) {
    var sessions = require('client-sessions');
    var csrf = require('csurf');




    app.adminauth = {
        adminloginRequired: adminloginRequired,
        adminlogin: adminlogin,
        adminlogout: adminlogout,
        adminalreadylogin: adminalreadylogin
    };


    app.use(sessions({
        cookieName: 'session', // cookie name dictates the key name added to the request object
        secret: '564sh1sth8trhs51hsrt54her5h1erh4pj5/p5,/[p8,', // should be a large unguessable string
        duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
        activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
    }));

    //==============middlewares==============
    app.use(function (req, res, next) {
        if (req.session && req.session.admin) {
            var id = req.session.admin.id;
            app.db.Admin.findById(id, function (err, result) {
                if (err) { next(); }
                req.admin = result;
                next();
            });
        } else {
            next();
        }
    })

    // app.use(function(req, res, next){
    //      if (req.session && req.session.msg) {
    //          req.msg = req.session.msg.text;
    //          next();
    //      }
    //      else{
    //          next();
    //      }
    // })
    function adminlogin(req, res, next) {
        var model = req.body;

        app.db.Admin.findOne({ "name": model.name }, function (err, entity) {

            if (entity && app.bcrypt.compareSync(model.pass, entity.pass)) {
                req.session.admin = {
                        id: entity._id
                    };
                next();
            }else{
                res.render('adm/admin/adminlogin', {csrfToken: req.csrfToken(), msg: 'يرجي التاكد من الاسم وكلمه السر'})
            }
                
        });
    }


    function adminlogout(req, res, next) {
        req.session.reset();
        next();
    }

    function adminloginRequired(req, res, next) {

        if (req.admin) {
            next();
        } else {
            req.session.returnurl = req.url;
            res.redirect('/adminlogin');
        };
    };

    function adminalreadylogin(req, res, next) {
        if (req.admin) {
            res.redirect('/admin');
        } else {
            next();
        }
    }
}