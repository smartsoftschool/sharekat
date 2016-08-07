module.exports = function (app) {
    app.get('/signup', function (req, res) {
        res.render('users/signup', { title: 'Login' });
    });
    app.get('/login', function (req, res) {
        res.render('users/login', { title: 'login' });
    });
}