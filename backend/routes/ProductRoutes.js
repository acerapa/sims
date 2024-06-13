const router = require('express').Router();
const ProductController = require('../controllers/ProductController');

router.get('/all', ProductController.all);
router.post('/update', ProductController.update);
router.delete('/delete', ProductController.delete);
router.post('/register', ProductController.register);

module.exports = router;
