const { Router } = require("express");
const router = Router();
const testRoutes = Router();
const { validateUserAuth } = require("../middleware/auth");

const protectedRoutes = Router();

protectedRoutes.use(validateUserAuth);

// start use routes
const authRoutes = require("./AuthRoutes");
router.use("/auth", authRoutes);

const userRoutes = require("./UserRouters");
protectedRoutes.use("/users", userRoutes);

const productCategoryRoutes = require("./ProuctCategoryRoutes");
protectedRoutes.use("/product-category", productCategoryRoutes);

const accountRoutes = require("./AccountRoutes");
protectedRoutes.use("/settings/accounts", accountRoutes);

const supplierRoutes = require("./SupplierRoutes");
protectedRoutes.use("/suppliers", supplierRoutes);

const productRoutes = require("./ProductRoutes");
protectedRoutes.use("/products", productRoutes);

const serviceRoutes = require("./ServiceRoutes");
protectedRoutes.use("/services", serviceRoutes);

const purchaseOrderRoutes = require("./PurchaseOrderRoutes");
protectedRoutes.use("/purchase-order", purchaseOrderRoutes);

const salesOrderRoutes = require("./SalesOrderRoutes");
protectedRoutes.use("/sales-order", salesOrderRoutes);

const productSettingRoutes = require("./ProductSettingRoutes");
protectedRoutes.use("/product-setting", productSettingRoutes);

const physicalInventoryRoutes = require("./PhysicalInventoryRoutes");
protectedRoutes.use("/physical-inventory", physicalInventoryRoutes);

const branchesRoutes = require("./BranchRoutes");
protectedRoutes.use("/branch", branchesRoutes);

const stockTransferRoutes = require("./StockTransferRoutes");
protectedRoutes.use("/stock-transfer", stockTransferRoutes);

const customerRoutes = require("./CustomerRoutes");
protectedRoutes.use("/customers", customerRoutes);

const notificationRoutes = require("./NotificationRoutes");
protectedRoutes.use("/notifications", notificationRoutes);

const paymentMethodRoutes = require("./PaymentMethodRoutes");
protectedRoutes.use("/payment-method", paymentMethodRoutes);

const invoiceRoutes = require("./InvoiceRoutes");
protectedRoutes.use("/invoices", invoiceRoutes);

const deliveryRoutes = require("./DeliveryRoutes");
protectedRoutes.use("/deliveries", deliveryRoutes);

const receivePaymentRoutes = require("./ReceivePaymentRoutes");
protectedRoutes.use("/received-payments", receivePaymentRoutes);
// end use routes

// register protected routes
router.use(protectedRoutes);

// testing
const testingRoutes = require("./TestingRoutes");
testRoutes.use(testingRoutes);

// include test routes
router.use("/test", testRoutes);

module.exports = router;
