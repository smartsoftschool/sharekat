module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('home', { title: 'Home', user: req.user });
    });
}