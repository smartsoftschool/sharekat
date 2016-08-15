var express = require("express");
var path = require("path");
var vash = require("vash");
var bodyparser = require('body-parser');
var dbLayer = require(path.join(__dirname, 'database/db'))

    


var app = express();
dbLayer.load();
app.dbLayer = dbLayer;
app.config = require(path.join(__dirname, 'config/config'));

app.set('view engine', "vash");



app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
require(path.join(__dirname, "/libs/auth"))(app);
require(path.join(__dirname, "/libs/mailer"))(app);



require(path.join(__dirname, '/routes/home'))(app);
require(path.join(__dirname, '/routes/user'))(app);


app.listen(3000, function (err) {
  if (err) throw err;
  console.log("server start at port 3000....");
});




