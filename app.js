const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 7777;
const routes = require('./routes/index');
const errorHandlers = require('./handlers/errorHandlers');

const app = express();

// set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', routes);

//TODO SET UP ERROR HANDLERS!!! 
    // so that if the user navigates to a non-existent route, the user will see a friendly message rendered, instead of the default error code.
//error handler middleware goes after all routes
//404 handler
app.use(errorHandlers.notFound);

//render the error page
app.use(errorHandlers.renderError);

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});

module.exports = app;