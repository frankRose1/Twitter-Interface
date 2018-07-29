//use this instead of try/catch for async await error handling
//if there is an error .catch will pass it to next immediately
exports.catchErrors = (fn) => {
    return function(req, res, next) {
        return fn(req, res, next).catch(next);
    };
};

//For a route that is not found, mark it as as 404 and pass it along to the next middleware
exports.notFound = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
};

//pass the errors here and render them
exports.renderError = (err, req, res, next) => {
    //res.status sets the HTTP status for the response
    res.status(err.status || 500);
    res.render('error', {message: err.message, status: err.status});
};