const Datastore = require('nedb');

var db = {}
db.users = new Datastore({ filename: __dirname + '/../database/userV2.json', autoload:true});
db.projects = new Datastore({ filename: __dirname + '/../database/projectV2.json', autoload:true});

module.exports = db;