const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

//Handle get request to home page
router.get('/',homeController.home);

module.exports = router;