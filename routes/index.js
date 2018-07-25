const express = require('express');
const router = express.Router();
const tweetsController = require('../controllers/tweetsController'); //outsource the methods to the tweetsController file
const {catchErrors} = require('../handlers/errorHandlers'); //wrap the async functions in error handlers

// router.get('/', catchErrors(tweetsController.getTweets));
// router.get('/', catchErrors(tweetsController.getFriends));
router.get('/', catchErrors(tweetsController.getDirectMessages));

module.exports = router;