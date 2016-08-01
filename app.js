var express = require("express");
var psth = require("path");
var vash = require("vash");

var app = express();

app.set('view engine',"vash");

app.use(express.static(__dirname + '/public'));

app.get('/' , function (req, res){
    res.render('layouts/main')
})

app.listen(3000 , function (err) {
    if(err) throw err;
});

console.log("server start at port 3000....");