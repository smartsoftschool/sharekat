module.exports = function (app) {
    app.get('/signup', function (req, res) {
        res.render('users/signup', { title: 'Login' });
    });
}