//use this instead of try/catch for async await error handling
//if there is an error .catch will pass it to next immediately
exports.catchErrors = (fn) => {
    return function(req, res, next) {
        //this would be the async function
        return fn(req, res, next).catch(next);
    };
};

//set up other error handlers here (e.g handle 404 errors);