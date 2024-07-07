const Router = require('express').Router();
const PurchaseOrderController = require('../controllers/PurchaseOrderController');

Router.get('/all', PurchaseOrderController.all);
Router.get('/:id', PurchaseOrderController.byId);
Router.post('/register', PurchaseOrderController.register);
Router.delete('/delete', PurchaseOrderController.delete);

module.exports = Router;
