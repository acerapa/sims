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

const purchaseOrderRoutes = require("./PurchaseOrderRoutes");
router.use("/purchase-order", purchaseOrderRoutes);

const productSettingRoutes = require("./ProductSettingRoutes");
router.use("/product-setting", productSettingRoutes);

const physicalInventoryRoutes = require("./PhysicalInventoryRoutes");
router.use("/physical-inventory", physicalInventoryRoutes);

const branchesRoutes = require("./BranchRoutes");
router.use("/branch", branchesRoutes);

const stockTransferRoutes = require("./StockTransferRoutes");
router.use("/stock-transfer", stockTransferRoutes);
// end use routes

module.exports = router;
