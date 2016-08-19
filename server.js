var express = require("express");
var app = express();
var db = require("./db.js");
var mongo_uri = 'mongodb://localhost:27017/urlshortener';

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 7; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

app.get('/:uuid', function(req, res) {
    var urls = db.get().collection('urls');
    urls.find({ short: req.params.uuid }).toArray(
        (err, data) => {
            if (err) {
                res.status(404).json({error: "No URL found!"});
            } else {
                res.redirect(data[0].long);
            }
        })
});

app.get('/new/:url(*)', function(req, res) {
    // 1. Check if :url is a valid url
    var regex = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
    if (!req.params.url.match(regex)) {
        res.status(400).json({error: "No valid URL."});
    } else {
        var urls = db.get().collection('urls');
        var url_data = {
            short: makeid(),
            long: req.params.url
        };
        urls.insert(url_data, (err, data) => {
            if (err) throw err;
            res.status(200).json(url_data);
        });
    }
});

// Connect to Mongo on start
var port = process.env.PORT || 8080;
db.connect(mongo_uri, function(err) {
    if (err) {
        console.log('Unable to connect to Mongo.')
        process.exit(1)
    } else {
        app.listen(port, function() {
        console.log('Listening on port ' + port);
    })
  }
});