module.exports = function (app) {


    app.get('/user/register', function (req, res) {
        res.render('user/register')
    });

    app.post('/user/register', function (req, res) {
        var model = req.body;

        if (model.pass === model.passconfirm) {
            var entity = {
                name: model.name,
                email: model.email,
                pass: model.pass,
                active: Date.now()
            }
            app.dbLayer.db.users.push(entity);
            app.dbLayer.save();
            console.log('sending mail...');
            sendActivationMail(req, res, entity);

        } else {
            res.redirect('/user/register')
        }

    });

    function sendActivationMail(req, res, entity) {
        app.mailer.send('user/activationMail', {
                to: entity.email, // REQUIRED 
                subject: 'شركات مصر', // REQUIRED.
                link: 'http://' + app.config.siteAddress + ':' + app.config.sitePort + '/user/activate/' + entity.active
            }, function (err, msg) {
                if (err) {
                    console.log(err);
                    res.send('There was an error sending the email');
                } else {
                res.redirect('/user/login');
                }
            });
    }



    app.get('/user/login', function (req, res) {
        res.render('user/login', { title: 'login' });
    });



    app.post('/user/login', app.auth.login, function (req, res) {
        var url = req.session.returnurl || '/';
        res.redirect(url);
    });

    app.get('/user/logout', app.auth.logout, function (req, res) {
        res.redirect('/');
    });

    app.get('/user/activate/:active', function(req, res) {
        var active = req.params.active;

        var entity = app.dbLayer.db.users.find(function(x) {
            return  x.active == active;
        })

        if(entity) {
            entity.active = null;
            app.dbLayer.save();
            
            res.render('user/activationDone');
        } else {
            res.render('user/activationFailed');
        }
    })

};