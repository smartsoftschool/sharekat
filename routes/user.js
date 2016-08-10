module.exports = function (app) {
    var sessions = require('client-sessions');

    app.get('/user/add-adv',app.auth.loginRequired , function (req,res) {
        res.render('user/add-adv')
    })

    app.get('/user/register', function (req, res) {
        res.render('user/register')
    });

    app.post('/user/register' , function (req , res) {
      var user = req.body;

      if (user.pass === user.passconfirm){
          var newuser = {
              name: user.name,
              email: user.email,
              pass: user.pass
          }
          app.dbLayer.db.users.push(newuser);
          app.dbLayer.save();
          res.redirect('/');
      }else {
      res.redirect ('/user/register')}
    });


    app.get('/user/login', function (req, res) {
        res.render('user/login', { title: 'login' });
    });


    
    app.post('/user/login',app.auth.login,function (req,res) {
        var url = req.session.returnurl || '/';
        res.redirect(url);
    });

    app.get('/user/logout' ,app.auth.logout ,function (req,res) {
        res.redirect('/');
    });


};