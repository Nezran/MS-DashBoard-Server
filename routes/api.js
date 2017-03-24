const express = require("express");
const bodyParser = require("body-parser");
const assert = require('assert');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const config = require('../config');
const cors = require('cors');

let User = require('../models/User');
let Project = require('../models/Project');

const AUTH = 'x-access-token';

const app = express();

app.set('secret', config.secret);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var apiRoutes = express.Router();

// Authenticate route

app.get('/test', (req, res) => {
    console.log("test");
    Project.search("test");
    res.json("fdsfdsfsd");
});

app.post("/auth", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    User.findByUserName(username).then((user) => {
        console.log("test user ", user);
        if (user && user.checkPassword(password)) {
            delete user.password;
            var token = jwt.sign(user, app.get('secret'), {
                expiresIn: 144000
            });
            res.json(token);
        } else {
            res.status(401).json("User name or password invalid");
        }
    }).catch((err) => {
        res.status(401).json("User name or password invalid");
        console.error("error : ", err);
        res.json(err);
    });
});


// Insecure routes

app.get("/projects", (req, res) => {
    Project.all().then((projects) => {
        res.json(projects);
    }).catch((err) => {
        console.log(err)
    });
});

// Titre, description, tags
// TODO
app.get("/projects/search", (req, res) => {
    var search = req.query.search;
    Project.search(search).then((projects) => {
        res.json(projects);
    }).catch(err => {
        console.error(err);
        res.status(500).json("/project/filtered : RIP show log");
    });
});

app.get("/projects/filtered", (req, res) => {
    var type = req.query.filterType;
    var value = req.query.value;
    Project.find({ [type]: value }).then((projects) => {
        res.json(projects);
    }).catch(err => {
        console.error(err);
        res.status(500).json("/project/filtered : RIP show log");
    });
});

app.get("/projects/:id", (req, res) => {
    let id = req.params.id;
    Project.findById(id).then((project) => {
        res.json(project);
    }).catch(err => res.status(403).json("Project id not found"));
});

app.get('/roles', (req, res) => {
    res.json(["Administrator", "Project Manager"]);
});


app.get('/tags', (req, res) => {
    Project.getAllTags().then((tags) => {
        res.json(tags);
    });
});

// AUTH MIDDLEWARE

// route middleware to check the token
apiRoutes.use(function (req, res, next) {
    var token = req.headers[AUTH];
    if (token) {
        jwt.verify(token, app.get('secret'), function (err, decoded) {
            if (err) {
                // console.log(err);
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                console.log("decoded", decoded);
                req.user = decoded;
                next();
            }
        });
    }
    // Code to accept no token authentication
    else {
        req.user = null;
        next();
    }
    /*
        Code to return an error if there is no token provided instead of just ignoring it
     */
    // else {
    //     return res.status(403).send({
    //         success: false,
    //         message: 'No token provided.'
    //     });
    // }
});

// Routes that are secured by token
app.use(apiRoutes);


// Secure routes
app.post("/projects", (req, res) => {

    // Optional
    var id = req.body.userId;
    var currentUser = req.user;

    var project = new Project(
        {
            title: req.body.title,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            deadline: req.body.deadline,
            status: req.body.status,
            nbWorker: req.body.nbWorker,
            tags: req.body.tags,
            projectManager: req.user
        });
    project.save().then((ok) => {
        res.json("ok");
    }).catch(err => {
        console.log(err);
        res.status(400).json("project not created");
    });
});


app.put("/projects", (req, res) => {
    let id = req.body.id;
    Project.findById(id).then((project) => {
		var newProject = {
			projectManager: req.body.projectManager,
			title: req.body.title,
			description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
			deadline: req.body.deadline,
			status: req.body.status,
			tags: req.body.tags,
			nbWorker: req.body.nbWorker
		};
        project.update(newProject).then((nProject) => {
            res.json(nProject);
        }).catch(err => {
            console.log(err);
            res.status(400).json("Project not found");
        });
    });
});

app.delete("/projects", (req, res) => {
    let id = req.body.id;
    Project.remove(id).then((ok) => {
        res.json("ok");
    }).catch((err) => {
        console.error("rip : ", err);
        res.status(400).json("Remove error");
    });
});

app.post("/user", (req, res) => {
    User.findByUserName(req.body.username).then((u) => {
        res.status(500).json('Le nom d\'utilisateur existe déjà');
    }).catch((no) => {
        let user = new User({ firstname: req.body.firstname, lastname: req.body.lastname, username: req.body.username, email: req.body.email, role: req.body.role });
        user.setPassword(req.body.password);
        user.save();
        res.json('Votre compte a bien été créé');
    });
});

app.delete("/user/:id", (req, res) => {
    let id = req.params.id;
    res.json(id);
    User.remove(id).then((ok) => {
        res.json("ok");
    }).catch((err) => {
        console.error("rip : ", err);
        res.status(400).json("Remove error");
    });
});

app.put("/user", (req, res) => {
    let id = req.body.id;
    User.findById(id).then((user) => {
        var newUser = {
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            role: req.body.role,
            email: req.body.email,
            password: req.body.password,
        };

        user.update(newUser).then((nUser) => {
            res.json(nUser);
        }).catch(err => {
            console.log(err);
            res.status(400).json("User not found");
        });
    });
});


app.get("/users", (req, res) => {
    User.all().then((users) => {
        res.json(users);
    }).catch((err) => {
        console.log(err);
    });
});

app.delete("/projects/all", (req, res) => {
    console.log(req.user);
    if (req.user.role == 'Administrator') {
        Project.removeAll().then((remove) => {
            res.json("All user removed");
        }).catch((err) => {
            console.err("Error : ", err);
            res.status(500).json("RIP");
        })
    } else {
        res.status(403).json("admin only");
    }
});



module.exports = app;