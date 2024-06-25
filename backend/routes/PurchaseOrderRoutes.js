const Router = require('express').Router();
const PurchaseOrderController = require('../controllers/PurchaseOrderController');

Router.get('/all', PurchaseOrderController.all);
Router.post('/register', PurchaseOrderController.register);

module.exports = Router;
