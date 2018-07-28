//use this instead of try/catch for async await error handling
//if there is an error .catch will pass it to next immediately
exports.catchErrors = (fn) => {
    return function(req, res, next) {
        //this would be the async function
        return fn(req, res, next).catch(next);
    };
};

//For a route that is not found, mark it as as 404 and pass it along to the next middleware
exports.notFound = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    console.log('from inside the notFound handler');
    next(err);
};

//403 error?

//pass the errors here and render them
exports.renderError = (err, req, res, next) => {
    //res.status sets the HTTP status for the response
    res.status(err.status || 500);
    console.log('from inside the REnDER handler');
    res.render('error', {message: err.message, status: res.status});
};