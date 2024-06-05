const router = require('express').Router();
const ProductCategoryController = require('../controllers/ProductCategoryController');

router.get('/all', ProductCategoryController.all);
router.post('/update', ProductCategoryController.update);
router.delete('/delete', ProductCategoryController.delete);
router.post('/register', ProductCategoryController.register);

module.exports = router;
