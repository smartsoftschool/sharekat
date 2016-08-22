module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('home', { user: req.user });
    });
}