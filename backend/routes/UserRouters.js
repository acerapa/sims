const router = require('express').Router();
const UserController = require('../controllers/UserController');

router.get('/all', UserController.all);
router.post('/register', UserController.register);

module.exports = router;
