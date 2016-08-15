module.exports = function (app) {
  
    var mailer = require('express-mailer');

    mailer.extend(app, {
        from: app.config.mailSender.from,
        host: app.config.mailSender.host, // hostname
        secureConnection: true, // use SSL
        port: app.config.mailSender.port, // port for secure SMTP
        transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
        auth: {
            user: app.config.mailSender.email,
            pass: app.config.mailSender.password
        }
    });
  
}