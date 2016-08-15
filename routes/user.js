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
                id: Date.now(),
                verf: false
            }
            app.dbLayer.db.users.push(entity);
            app.dbLayer.save();
            console.log('sending mail ...');
            sendActivationMail(req, res, entity);

        } else {
            res.redirect('/user/register')
        }

    });

    app.get('/user/re-verify/:userId', function(req, res) {
        var id = req.params.userId;
        var entity = app.dbLayer.db.users.find(function(x) {
            return  x.id == id;
        });
        
        console.log('resending mail ...');
        sendActivationMail(req, res, entity);
    })

    function sendActivationMail(req, res, entity) {
        app.mailer.send('user/activationMail', {
                to: entity.email, // REQUIRED 
                subject: 'شركات مصر', // REQUIRED.
                link: 'http://' + app.config.siteAddress + ':' + app.config.sitePort + '/user/activate/' + entity.id
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

    app.get('/user/activate/:id', function(req, res) {
        var id = req.params.id;

        var entity = app.dbLayer.db.users.find(function(x) {
            return  x.id == id;
        })

        if(entity) {
            entity.verf = true;
            app.dbLayer.save();
            
            res.render('user/activationDone');
        } else {
            res.render('user/activationFailed');
        }
    })

};