var express = require("express");
var path = require("path");
var vash = require("vash");

var app = express();

app.set('view engine',"vash");

app.use(express.static(__dirname + '/public'));

require(path.join(__dirname + '/routes/home'))(app);
require(path.join(__dirname + '/routes/signup'))(app);

app.listen(3000 , function (err) {
    if(err) throw err;
});

console.log("server start at port 3000....");


