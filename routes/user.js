module.exports = function (app) {
    var sessions = require('client-sessions');


    var mailer = require('express-mailer');

    mailer.extend(app, {
        from: 'no-reply@example.com',
        host: 'gator3086.hostgator.com', // hostname
        secureConnection: true, // use SSL
        port: 465, // port for secure SMTP
        transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
        auth: {
            user: 'sharekat@smartsoft-eg.com',
            pass: 'sharekat'
        }
    });


    app.get('/user/add-adv', app.auth.loginRequired, function (req, res) {
        res.render('user/add-adv')
    })

    app.get('/user/register', function (req, res) {
        res.render('user/register')
    });

    app.post('/user/register', function (req, res) {
        var user = req.body;

        if (user.pass === user.passconfirm) {
            var newuser = {
                name: user.name,
                email: user.email,
                pass: user.pass,
                active: Date.now()
            }
            app.dbLayer.db.users.push(newuser);
            app.dbLayer.save();
            app.mailer.send('user/activationMail', {
                to: user.email, // REQUIRED. This can be a comma delimited string just like a normal email to field. 
                subject: 'شركات مصر', // REQUIRED.
                active: newuser.active // All additional properties are also passed to the template as local variables.
            }, function (err) {
                if (err) {
                    // handle error
                    console.log(err);
                    res.send('There was an error sending the email');
                    return;
                }
                res.render('user/pleaseactivate')
            });

        } else {
            res.redirect('/user/register')
        }

    });





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

    app.get('/user/forget', function (req, res) {
        res.render('user/forget');
    })

    app.get('/user/forgetpass', function (req, res, next) {
        app.mailer.send('passreset/passreset.vash', {
            to: 'example@example.com', // REQUIRED. This can be a comma delimited string just like a normal email to field. 
            subject: 'Test Email', // REQUIRED.
            otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
        }, function (err) {
            if (err) {
                // handle error
                console.log(err);
                res.send('There was an error sending the email');
                return;
            }
            res.send('Email Sent');

        });
    });
};