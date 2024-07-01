const router = require("express").Router();
// start use routes
const authRoutes = require("./AuthRoutes");
router.use("/auth", authRoutes);

const userRoutes = require("./UserRouters");
router.use("/users", userRoutes);

const productCategoryRoutes = require("./ProuctCategoryRoutes");
router.use("/product-category", productCategoryRoutes);

const accountRoutes = require("./AccountRoutes");
router.use("/settings/accounts", accountRoutes);

const supplierRoutes = require("./SupplierRoutes");
router.use("/suppliers", supplierRoutes);

const productRoutes = require("./ProductRoutes");
router.use("/products", productRoutes);

const purchaseOrderRoutes = require('./PurchaseOrderRoutes');
router.use("/purchase-order", purchaseOrderRoutes);
// end use routes

module.exports = router;
