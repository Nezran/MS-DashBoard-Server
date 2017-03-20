var db = require('../utils/databases');
var User = require('./User');
var _ = require('lodash');

class Project {

    constructor(data) {
        if(data){
            this.id = data._id || data.id || null;
            this.title = data.title || null;
            this.description = data.description || null;
            this.deadline = data.deadline || null;
            this.startDate = data.startDate || null;
            this.endDate = data.endDate || null;
            this.status = data.status || null;
            this.tags = data.tags || [];
            this.nbWorker = data.nbWorker || 0;
            // Type : User
            this.projectManager = new User(data.projectManager) || null;
        }
    }

    static getAllTags(){
        return new Promise(function (resolve, reject) {
            db.projects.find({}, function (err, projects) {
                if(err) reject(err);
                var temp = [];
                projects.forEach((project) =>{
                    temp = temp.concat(project.tags);
                })
                resolve(_.uniq(temp));
            });
        });
    }

    static all() {
        return new Promise(function (resolve, reject) {
            db.projects.find({}, function (err, projects) {
                if(err) reject(err);
                var temp = [];
                projects.forEach((project) =>{
                    temp.push(new Project(project));
                })
                resolve(temp);
            });
        });
    }

    /**
     * Find with exactly same value.
     * Example: find({admin: true}) // an array of admin user
     */
    static find(search) {
        return new Promise(function (resolve, reject) {
            var key = Object.keys(search)[0];
            if(key){
                db.projects.find({ [key]: new RegExp(search[key], 'i')}, function (err, projects) {
                    var temp = [];
                    if(err) reject(err);
                    projects.forEach((project) =>{
                        temp.push(new Project(project));
                    })
                    resolve(temp);
                });
            }else{
                resolve([]);
            }
            
        });
    }

    static findByTag(tag) {
        /* TODO */
        return new Promise(function (resolve, reject) {
            reject("not implemented");
        });
    }

    static likeString(key, value){
        return new Promise(function (resolve, reject) {
            db.projects.find({ [key]: new RegExp(value, 'i')}, function (err, projects) {
                var result = [];
                if(err) reject(err);
                projects.forEach((project) => {
                    result.push(new Project(u));
                });
                resolve(result);
            });
        });
    }

    static findById(id) {
        return new Promise(function (resolve, reject) {
            db.projects.findOne({ _id: id }, function (err, project) {
                if(err) reject(err);
                resolve(new Project(project));
            });
        });
    }

    static search(search) {
        return find(search);
    }

    save() {
        var self = this;
        console.log("save : ", self);
        return new Promise(function (resolve, reject) {
            db.projects.remove({ _id: self.id }, {}, function (err, numRemoved) {
                db.projects.insert(new Project(self), function (err, u) { 
                    if(err) reject(err);
                    resolve(new Project(u));
                });
            });
            
        });
    }
	
	update(data){
		var self = this;
		return new Promise(function (resolve, reject) {
			db.projects.update({_id: self.id}, new Project(data), function (err, u) { 
				if(err) reject(err);
				db.projects.findOne({ _id: self.id }, function (err, project) {
					if(err) reject(err);
					resolve(new Project(project));
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
             db.projects.remove(remove, { multi: true }, function (err, numRemoved) {
                 if(err) reject(err);
                 resolve(numRemoved);
             });
        });
    }

    static removeAll() {
        return Project.remove(null);
    }
}

module.exports = Project;