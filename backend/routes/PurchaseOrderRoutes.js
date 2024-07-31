const Router = require('express').Router();
const PurchaseOrderController = require('../controllers/PurchaseOrderController');

Router.get('/all', PurchaseOrderController.all);
Router.get('/:id', PurchaseOrderController.byId);
Router.delete('/delete', PurchaseOrderController.delete);
Router.post('/:id/update', PurchaseOrderController.update);
Router.post('/register', PurchaseOrderController.register);

module.exports = Router;
