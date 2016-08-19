// db_url = "mongodb://<dbuser>:<dbpassword>@ds063715.mlab.com:63715/urlshortener"

var mongo = require("mongodb").MongoClient;
var mongo_uri = 'mongodb://localhost:27017/urlshortener';

var state = {
  db: null,
}

exports.connect = function(url, done) {
  if (state.db) return done()

  mongo.connect(url, function(err, db) {
    if (err) return done(err)
    state.db = db
    done()
  })
}

exports.get = function() {
  return state.db
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}