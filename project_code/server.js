var express = require('express');
var port = 3474;
var app = express();
var path = require('path');

var hbs = require('hbs');

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.engine('html', hbs.__express);
app.set('view engine', 'html');

app.listen(port);
console.log("Express started on " + port);

app.get("/", function(req, res){
  res.render('index');
});

app.get("/photos", function(req, res){

  // 1. Call Picasa API and get featured images
  // 2. Use xml2js to convert it to a js object
  // 3. download 500 * 500 15 images
  var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://picasaweb.google.com/data/feed/api/featured", false );
  xhr.send( null );
  var parseString = require('xml2js').parseString;
  parseString(xhr.responseText, function (err, result) {
    var photos = result.feed.entry;
    var index = 0;
    // Remove all files in dir before copying new ones
    removeFilesInDir("./public/images");
    for(var i=0; index<15 && i<photos.length; i++) {
      if(parseInt(photos[i]['media:group'][0]['media:content'][0]['$']['height']) >= 500 ||
       parseInt(photos[i]['media:group'][0]['media:content'][0]['$']['width']) >= 500) {
       var photoUrl = photos[i]['media:group'][0]['media:content'][0]['$']['url'];
       //copy image locally
       copyImageLocally(photoUrl, "./public/images/image" + (index+1) + ".jpg");
       index ++;
     }
    }
  });
});

var copyImageLocally = function(imageSrc, newFile) {
  var https = require('https');
  var fs = require('fs');

  var file = fs.createWriteStream(newFile);
  var request = https.get(imageSrc, function(response) {
    response.pipe(file);
  });
};

var removeFilesInDir = function(dirPath) {
  var fs = require('fs');

  try {
    var files = fs.readdirSync(dirPath);
  }
  catch(e) {
    return;
  }

  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
    }
};
