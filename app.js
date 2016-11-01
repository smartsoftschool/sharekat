var express = require("express");
var path = require("path");
var vash = require("vash");
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var shortid = require('shortid');
var csrf = require('csurf');
var app = express();

mongoose.connect('mongodb://localhost/sharekat', function (err) {

  if (err) throw err;

  app.db = require(__dirname + '/models');
  app.mongoose = mongoose;
  app.bcrypt = bcrypt;
  app.shortid = shortid;
  app.msg = {
    get: function () {
      var msg = this.msg;
      this.msg = null;
      return msg;
    },
    set: function (msg) {
      this.msg = msg;
    }
  }
  app.config = require(path.join(__dirname, 'config/config-smartsoft'));

  app.set('view engine', "vash");



  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/node_modules'));
  app.use(express.static(__dirname + '/views/adm'));
  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(bodyparser.json());
  require(path.join(__dirname, "/libs/auth"))(app);
  require(path.join(__dirname, "/libs/adminauth"))(app);
  require(path.join(__dirname, "/libs/mailer"))(app);
  app.use(csrf());



  require(path.join(__dirname, '/routes/opr/home'))(app);
  require(path.join(__dirname, '/routes/adm/home'))(app);
  require(path.join(__dirname, '/routes/opr/user'))(app);
  require(path.join(__dirname, '/routes/adm/admin'))(app);


  app.listen(3000, function (err) {
    if (err) throw err;
    console.log("server start at port 3000....");
  });

})


