const router = require('express').Router();
const AuthController = require('../controllers/AuthController');

router.get('/all', AuthController.all);
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/token/verify', AuthController.verify);
router.post('/token/refresh', AuthController.refresh);

module.exports = router;
