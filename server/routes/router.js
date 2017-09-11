const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const customers = require('./customers');
const locations = require('./locations');
const trips = require('./trips');

router.use(bodyParser.urlencoded({extended: true}));

router.get('/', ((req,res) => {
    res.render('index');
}));

router.use('/customers', customers);
router.use('/locations', locations);
router.use('/trips', trips);

module.exports = router;