module.exports = function (app) {



    app.get('/user/register', app.auth.alreadylogin, function (req, res) {
        res.render('opr/user/register', { csrfToken: req.csrfToken() });
    });

    app.post('/user/register', function (req, res) {
        var model = req.body;

        console.log(model);
        app.bcrypt.hash(model.pass, null, null, function (err, hash) {
            if (model.pass === model.passconfirm) {

                var entity = new app.db.User();
                entity.name = model.name;
                entity.email = model.email;
                entity.pass = hash;
                entity.gender = model.gender;
                entity.birthdate = model.birthdate;

                var address = {
                    country: model.country,
                    state: model.state,
                    city: model.city,
                    zone: model.zone
                }

                entity.address = address;
                console.log(entity);

                var verf = new app.mongoose.Types.ObjectId;
                entity.verf = verf;

                entity.save(function (err, result) {
                    if (err) {
                        res.render("opr/user/register", { csrfToken: req.csrfToken() })
                    };

                    console.log('sending mail ...');
                    sendActivationMail(req, res, entity);
                })

            } else {
                res.render('opr/user/register', { csrfToken: req.csrfToken(), msg: 'الرجاء التالكد من صحه البيانات' })

            }
            console.log(hash)
        });


    });

    

    app.get('/user/re-verify/:userId', function (req, res) {
        var id = req.params.userId;

        app.db.User.findById(id, function (err, entity) {
            sendActivationMail(req, res, entity);
            console.log('resending mail ...');
        });
    })

    function sendActivationMail(req, res, entity) {
        app.mailer.send('opr/user/mail-views/activationMail', {
            to: entity.email, // REQUIRED 
            subject: 'شركات مصر', // REQUIRED.
            link: 'http://' + app.config.site.address + ':' + app.config.site.port + '/user/activate/' + entity.verf
        }, function (err, msg) {
            if (err) {
                console.log(err);
                res.render("opr/user/mail-views/pleaseactivate", {entityId: entity._id});
            } else {
                res.render('opr/user/mail-views/activatemessage');
            }
        });
    }
    function sendPassresetMail(req, res, entity) {
        app.mailer.send('user/mail-views/activationMail', {
            to: entity.email, // REQUIRED 
            subject: 'شركات مصر', // REQUIRED.
            link: 'http://' + app.config.site.address + ':' + app.config.site.port + '/user/changepasswordreq/' + entity.passresetid
        }, function (err, msg) {
            if (err) {
                console.log(err);
                res.send('There was an error sending the email');
            } else {
                res.render('opr/user/mail-views/passresetmessage');
            }
        });
    }



    app.get('/user/login', app.auth.alreadylogin, function (req, res) {
        res.render('opr/user/login', { csrfToken: req.csrfToken() });
    });



    app.post('/user/login', app.auth.login, function (req, res) {
        var url =  '/';
        // req.session.returnurl ||
        res.redirect(url);
    });

    app.get('/user/logout', app.auth.logout, function (req, res) {
        res.redirect('/');
    });

    app.get('/user/activate/:id', function (req, res) {
        var id = req.params.id;
        app.db.User.update({ verf: id }, { $set: { verf: undefined } }, function (err, entity) {
            if (err) { res.render('user/mail-views/activationFailed') };
            if (entity) {
                res.render('opr/user/mail-views/activationDone');
            } else {
                res.render('opr/user/mail-views/activationFailed');
            }
        })


    })

    app.get('/user/forgetpassword', function (req, res) {
        res.render('opr/user/forgetpassword', { csrfToken: req.csrfToken() })
    })

    app.post('/user/forgetpassword', function (req, res) {
        var email = req.body.email;
        var passresetid = new app.mongoose.Types.ObjectId;

        app.db.User.findOne({ email: email }, function (err, entity) {
            if (entity) {
                app.db.User.findById({ _id: entity._id }, { $set: { passresetid: passresetid } }, function (err, result) {

                    app.db.User.findById({ _id: entity._id }, function (err, entity) {

                        sendPassresetMail(req, res, entity);
                    })
                })

            } else {
                res.render('opr/user/forgetpassword', { csrfToken: req.csrfToken(), msg: 'البريد الالكتروني غير صحيح' })
            }
        }
        )


    })

    app.get('/user/changepasswordreq/:id', function (req, res) {
        var id = req.params.id;
        app.db.User.findOne({ passresetid: id }, function (err, entity) {
            if (entity) {
                res.render('opr/user/mail-views/changepasswordconfirm', { user: entity, csrfToken: req.csrfToken() });
            } else {
                res.redirect('/')
            }
        })
    })

    app.post('/user/changepasswordconfirm', function (req, res) {
        var model = req.body;
        app.bcrypt.hash(model.pass, null, null, function (err, hash) {
            if (model.pass === model.passconfirm) {

                app.db.User.findById(model.id, function (err, entity) {
                    entity.pass = hash;
                    entity.passresetid = "";
                    app.db.User.update(entity, function (err, result) {
                        if (err) { res.redirect('opr/user/changepasswordconfirm') }
                        res.render('opr/user/login', { msg: "تم تغيير كلمه المرور يمكنك تسجيل الدخول الان", csrfToken: req.csrfToken() })
                    })
                })

            } else {
                res.render('opr/user/mail-views/changepasswordconfirm')
            }
        })
    })

    app.get('/user-profile', app.auth.loginRequired, function (req, res) {
        res.render('opr/user/user-profile/main', { user: req.user })
    })

    

}