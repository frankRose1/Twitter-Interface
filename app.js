//set up Express app and write API calls here
    //import config to be able to access twitters API

//PRIMARY OBJECTIVES
    //use the twitter API to populate the PUG file with this information:
        // your 5 most recent tweets
        // your 5 most recent friends
        // your 5 most recent direct messages
const express = require('express');
const Twit = require('twit');
const port = process.env.PORT || 7777;
const routes = require('./routes/index');

const app = express();

app.use(routes);

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});

module.exports = app;