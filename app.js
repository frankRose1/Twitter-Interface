//Using Node and Express, request the data needed from Twitter’s API, 
    //render it in template, and send it to the client at the “/” route. 
//PRIMARY OBJECTIVES
    //use the twitter API to populate the PUG file with this information:
        // your 5 most recent tweets
        // your 5 most recent friends
        // your 5 most recent direct messages
const express = require('express');
const path = require('path');
const port = process.env.PORT || 7777;
const routes = require('./routes/index');
const {consumer_key, consumer_secret, access_token, access_token_secret} = require('./config');
const app = express();

// set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// static files
app.use(express.static(__dirname + '/public'));

app.use(routes);

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});

module.exports = app;