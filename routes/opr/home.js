module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('opr/home', { user: req.user });
    });
}