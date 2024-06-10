const router = require('express').Router();
const SupplierController = require('../controllers/SupplierController');

router.get('/all', SupplierController.all);
router.post('/update', SupplierController.update);
router.delete('/delete', SupplierController.delete);
router.post('/register', SupplierController.register);

module.exports = router;
