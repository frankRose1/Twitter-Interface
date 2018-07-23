const express = require('express');
const router = express.Router();
const tweetsController = require('../conttrollers/tweetsController'); //outsource the methods to the tweetsController file
const {catchErrors} = require('../handlers/errorHandlers'); //must wrap the async functions in error handlers

router.get('/', catchErrors(tweetsController.getTweets));

module.exports = router;