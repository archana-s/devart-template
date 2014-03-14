var express = require('express');
var port = 3474;
var app = express();
var path = require('path');

var hbs = require('hbs');

app.set('views', __dirname + '/views');
app.use(express.static('public'));

app.engine('html', hbs.__express);
app.set('view engine', 'html');

app.listen(port);
console.log("Express started on " + port);

app.get("/", function(req, res){
  res.render('index');
});

app.use(express.static(__dirname + '/public'));
