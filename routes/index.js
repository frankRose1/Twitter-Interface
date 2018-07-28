const express = require('express');
const router = express.Router();
const twitterController = require('../controllers/twitterController'); //outsource the methods to the tweetsController file
const {catchErrors} = require('../handlers/errorHandlers'); //wrap the async functions in error handlers

router.get('/', catchErrors(twitterController.getTwitterData));
// router.get('/', catchErrors(twitterController.viewDms));
//update status from the interface
router.post('/update', catchErrors(twitterController.updateStatus));

module.exports = router;