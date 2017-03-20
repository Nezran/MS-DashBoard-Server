const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Seed = require('./seeds/Seed');
const apiRouter = require('./routes/api');

app.set('port', process.env.PORT || 23000);
app.set('host', process.env.HOST || 'localhost');

app.use('/api', apiRouter);

app.get('/seed', (req, res) => {
    var seed = new Seed();
    seed.clear().then(function(){
        console.log("test ! ");
        seed.seedDb();
    });
    res.json("database reseted !");
});

app.listen(app.get('port'), app.get('host'), _ => console.log(`Server runs => http://${app.get('host')}:${app.get('port')}`));