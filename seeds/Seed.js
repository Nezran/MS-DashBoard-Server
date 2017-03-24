var User = require('../models/User');
var Project = require('../models/Project');


class Seed {
    constructor() {

    }

    clear() {
        return new Promise(function (resolve, reject) {
            User.remove().then(function (u) {
                Project.remove().then(function (u) {
                    resolve(true);
                });
            });
        });
    }

    seedDb() {

        var promises = [];
        var userOne = new User({ username: "xavier",firstname: "Xavier", lastname: "CARREL", email: "x.c@cpnv.ch", role: "Project Manager" });
        userOne.setPassword("1234");
        promises.push(userOne.save());


        var userTwo = new User({ username: "jerome", firstname: "Jerome", lastname: "CHEVILLAT", email: "j.c@cpnv.ch", role: "Project Manager" });
        userTwo.setPassword("1234");
        promises.push(userTwo.save());

        var admin = new User({ username: "admin", firstname: "Admin", lastname: "Admin", email: "admin@cpnv.ch", role: "Administrator" });
        admin.setPassword("1234");
        promises.push(admin.save());

        Promise.all(promises).then((users) => {
            this.seedProject(users);
        });

    }

    seedProject(projectManagers) {
        var user1 = projectManagers[0];
        delete user1.password;
        var project1 = new Project({
            title: "Projet 1",
            description: "Premier projet pour test",
            status: 'Open',
            tags: ["javascript", "css", "html"],
            projectManager: user1,
            deadline: new Date(2017, 2, 25, 17, 30, 60),
            startDate: new Date(2017, 1, 25, 17, 30, 60),
            endDate: new Date(2017, 3, 25, 17, 30, 60)
        });
        project1.save();

        var user2 = projectManagers[1];
        delete user2.password;
        var project2 = new Project({
            title: "MAW2",
            description: "lorem ...",
            status: 'Close',
            tags: ["javascript", "css", "html"],
            projectManager: user2,
            deadline: new Date(2015, 2, 20, 17, 30, 60),
            startDate: new Date(2017, 1, 25, 17, 30, 60),
            endDate: new Date(2017, 2, 20, 17, 30, 60)
        });
        project2.save();

        var project3 = new Project({
            title: "Test",
            description: "lorem ...",
            status: 'Close',
            tags: ["javascript", "css", "html"],
            projectManager: projectManagers[1],
            deadline: new Date(2015, 1, 30, 17, 30, 60),
            startDate: new Date(2017, 1, 1, 17, 30, 60),
            endDate: new Date(2017, 1, 30, 17, 30, 60)
        });
        project3.save();

        var project4 = new Project({
            title: "Projet 4",
            description: "Le projet numéro 4",
            status: 'Open',
            tags: ["C#", ".NET"],
            projectManager: user1,
            deadline: new Date(2017, 2, 25, 17, 30, 60),
            startDate: new Date(2017, 1, 25, 17, 30, 60),
            endDate: new Date(2017, 4, 5, 17, 30, 60)
        });
        project4.save();

        var project5 = new Project({
            title: "Projet 5",
            description: "Le projet numéro 5",
            status: 'Close',
            tags: ["PHP", "Bootstrap"],
            projectManager: user1,
            deadline: new Date(2016, 2, 15, 17, 30, 60),
            startDate: new Date(2016, 1, 5, 17, 30, 60),
            endDate: new Date(2016, 2, 15, 17, 30, 60)
        });
        project5.save();

        var project6 = new Project({
            title: "Projet 6",
            description: "Le projet numéro 6",
            status: 'Open',
            tags: ["PHP", "Bootstrap"],
            projectManager: user1,
            deadline: new Date(2017, 2, 25, 17, 30, 60),
            startDate: new Date(2017, 1, 25, 17, 30, 60),
            endDate: new Date(2017, 3, 25, 17, 30, 60)
        });
        project6.save();

        var project7 = new Project({
            title: "Projet 7",
            description: "Le projet numéro 7",
            status: 'Close',
            tags: ["Java", "Android"],
            projectManager: user1,
            deadline: new Date(2016, 5, 25, 17, 30, 60),
            startDate: new Date(2016, 1, 25, 17, 30, 60),
            endDate: new Date(2016, 5, 25, 17, 30, 60)
        });
        project7.save();

        var project8 = new Project({
            title: "Projet 8",
            description: "Le projet numéro 8",
            status: 'Open',
            tags: ["PHP", "Bootstrap"],
            projectManager: user1,
            deadline: new Date(2017, 2, 25, 17, 30, 60),
            startDate: new Date(2016, 1, 25, 17, 30, 60),
            endDate: new Date(2017, 3, 25, 17, 30, 60)
        });
        project8.save();

        var project9 = new Project({
            title: "Projet 9",
            description: "Le projet numéro 9",
            status: 'Close',
            tags: ["SQL", "phpMyAdmin"],
            projectManager: user1,
            deadline: new Date(2015, 1, 25, 17, 30, 60),
            startDate: new Date(2015, 1, 1, 17, 30, 60),
            endDate: new Date(2015, 1, 25, 17, 30, 60)
        });
        project9.save();

        var project10 = new Project({
            title: "Projet 10",
            description: "Le projet numéro 10",
            status: 'Close',
            tags: ["C"],
            projectManager: user1,
            deadline: new Date(2017, 2, 25, 17, 30, 60),
            startDate: new Date(2017, 1, 25, 17, 30, 60),
            endDate: new Date(2017, 3, 25, 17, 30, 60)
        });
        project10.save();
    }
}

module.exports = Seed;
