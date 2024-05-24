const router = require('express').Router();
const AuthController = require('../controllers/AuthController');

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/token/refresh', AuthController.refresh);

module.exports = router;
