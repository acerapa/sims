const router = require('express').Router();
const AccountController  = require('../controllers/AccountController');

router.get('/all', AccountController.all);

module.exports = router;
