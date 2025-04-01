const { Router } = require("express");
const router = Router();
const testRoutes = Router();
const { validateToken } = require("../middleware/authentication");

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

const serviceRoutes = require("./ServiceRoutes");
router.use("/services", serviceRoutes);

const purchaseOrderRoutes = require("./PurchaseOrderRoutes");
router.use("/purchase-order", purchaseOrderRoutes);

const salesOrderRoutes = require("./SalesOrderRoutes");
router.use("/sales-order", validateToken, salesOrderRoutes);

const productSettingRoutes = require("./ProductSettingRoutes");
router.use("/product-setting", productSettingRoutes);

const physicalInventoryRoutes = require("./PhysicalInventoryRoutes");
router.use("/physical-inventory", physicalInventoryRoutes);

const branchesRoutes = require("./BranchRoutes");
router.use("/branch", branchesRoutes);

const stockTransferRoutes = require("./StockTransferRoutes");
router.use("/stock-transfer", stockTransferRoutes);

const customerRoutes = require("./CustomerRoutes");
router.use("/customers", customerRoutes);

const notificationRoutes = require("./NotificationRoutes");
router.use("/notifications", notificationRoutes);

const paymentMethodRoutes = require("./PaymentMethodRoutes");
router.use("/payment-method", paymentMethodRoutes);

const invoiceRoutes = require("./InvoiceRoutes");
router.use("/invoices", invoiceRoutes);
// end use routes

// testing
const testingRoutes = require("./TestingRoutes");
testRoutes.use(testingRoutes);

// include test routes
router.use("/test", testRoutes);

module.exports = router;
