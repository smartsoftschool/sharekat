module.exports = function (app) {
   app.get('/admin', app.adminauth.adminloginRequired, function (req, res) {
        res.render('adm/home', { csrfToken: req.csrfToken(), admin: req.admin })
    })
}