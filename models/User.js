var db = require('../utils/databases');
const crypto = require('crypto');
const hash = crypto.createHash('sha256');



class User {

    constructor(data) {
        if(data){
            this.id = data._id || data.id || null;
            this.username = data.username || null;
            this.firstname = data.firstname || null;
            this.lastname = data.lastname || null;
            this.role = data.role || "Project manager";
            this.email = data.email || null;
            this.password = data.password || null;
        }
    }

    setPassword(password) {
        this.password = this._generateHash(password)
    }

    checkPassword(password) {
        return this.password == this._generateHash(password)
    }


    static all(){
        return new Promise(function (resolve, reject) {
            db.users.find({}, function (err, users) {
                if(err) reject(err);
                var temp = [];
                users.forEach((user) =>{
                    temp.push(new User(user));
                })
                resolve(temp);
            });
        });
    }

    /**
     * Find with exactly same value.
     * Example: find({admin: true}) // an array of admin user
     */
    static find(search){
        return new Promise(function (resolve, reject) {
            var key = Object.keys(search)[0];
            if(key){
                db.users.find({ [key]: new RegExp(search[key], 'i')}, function (err, users) {
                    var temp = [];
                    if(err) reject(err);
                    users.forEach((user) =>{
                        temp.push(new User(user));
                    })
                    resolve(temp);
                });
            }else{
                resolve([]);
            }
            
        });
    }

    static likeString(key, value){
        return new Promise(function (resolve, reject) {
            db.users.find({ [key]: new RegExp(value, 'i')}, function (err, users) {
                var result = [];
                if(err) reject(err);
                users.forEach((u) => {
                    result.push(u);
                });
                resolve(u);
            });
        });
    }

    static findByUserName(name) {
        return new Promise(function (resolve, reject) {
            db.users.findOne({ username: name }, function (err, u) {
                if(err) reject(err);
                if(u == null) reject(null);
                var instance = new User(u);
                resolve(instance);
            });
        });
    }

    static findById(id) {
        return new Promise(function (resolve, reject) {
            db.users.findOne({ _id: id }, function (err, u) {
                if(err) reject(err);
                var instance = new User(u);
                resolve(instance);
            });
        });
    }

    save() {
        var self = this;
        return new Promise(function (resolve, reject) {
            db.users.remove({ _id: self.id }, {}, function (err, numRemoved) {
                db.users.insert(new User(self), function (err, u) { 
                    if(err) reject(err);
                    resolve(new User(u));
                });
            });
            
        });
    }

    static remove(id) {
        var remove = {};
        if (id){
            remove = { _id: id };
        }
        return new Promise(function (resolve, reject) {
             db.users.remove(remove, { multi: true }, function (err, numRemoved) {
                 if(err) reject(err);
                 resolve(numRemoved);

             });
        });
    }

    _generateHash(password) {
        var sha256 = crypto.createHash('sha256').update(password).digest("hex");
        console.log(sha256);
        return sha256;
    }
}

module.exports = User;