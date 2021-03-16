'use strict';
var express = require('express');
var router = express.Router();

/* GET cities listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
    console.log("Attempt 2");
});

//router.get('/weather/city', function (req, res) {
//    res.send('About this city');
//})

module.exports = router;
