const User = require("./user");
const Branch = require("./branch");
const Address = require("./address");
const Account = require("./account");
const Product = require("./product");
const Supplier = require("./supplier");
const Customer = require("./customer");
const BranchMember = require("./branch-member");
const StockTransfer = require("./stock-transfer");
const PurchaseOrder = require("./purchase-order");
const PurchaseOrderProducts = require("./junction/purchase-order-products");
const ProductSettings = require("./product-setting");
const ProductSupplier = require("./product-supplier");
const ProductCategory = require("./product-category");
const PhysicalInventory = require("./physical-inventory");
const PhysicalInventoryItem = require("./physical-inventory-item");
const ProductToCategories = require("./junction/product-to-categories");
const ProductDetails = require("./product-details");
const ServiceDetails = require("./service-details");
const StockTransferProducts = require("./junction/stock-transfer-products");
const SalesOrder = require("./sales-order");
const SalesOrderProduct = require("./junction/sales-order-product");
const Invoice = require("./invoice");
const PaymentMethod = require("./payment-method");
const InvoiceToProducts = require("./junction/invoice-to-products");

// Sales Order, Product, Address and Sales Order Product Relations
SalesOrder.belongsToMany(Product, {
  through: SalesOrderProduct,
  foreignKey: "sales_order_id",
  otherKey: "product_id",
  as: "products",
});

Product.belongsToMany(SalesOrder, {
  through: SalesOrderProduct,
  foreignKey: "product_id",
  otherKey: "sales_order_id",
  as: "sales_orders",
});

SalesOrder.belongsTo(Address, {
  foreignKey: "shipment_address_id",
  as: "shipment_address",
});

SalesOrder.belongsTo(PaymentMethod, {
  foreignKey: "payment_method_id",
  as: "payment_method",
});

// Purchase Order, Purchase Order Product and Product Relations
PurchaseOrder.belongsToMany(Product, {
  through: PurchaseOrderProducts,
  foreignKey: "purchase_order_id",
  otherKey: "product_id",
  as: "products",
});

Product.belongsToMany(PurchaseOrder, {
  through: PurchaseOrderProducts,
  foreignKey: "product_id",
  otherKey: "purchase_order_id",
  as: "purchase_orders",
});

// Stock Transfer, Product and Stock Transfer Product Relations
StockTransfer.belongsToMany(Product, {
  through: StockTransferProducts,
  foreignKey: "stock_transfer_id",
  otherKey: "product_id",
  as: "products",
});

Product.belongsToMany(StockTransfer, {
  through: StockTransferProducts,
  foreignKey: "product_id",
  otherKey: "stock_transfer_id",
  as: "stock_transfers",
});

// Product Category and General Product Category Relations
ProductCategory.hasMany(ProductCategory, {
  foreignKey: "general_cat",
  as: "sub_categories",
  onDelete: "CASCADE",
  hooks: true,
});

ProductCategory.belongsTo(ProductCategory, {
  foreignKey: "general_cat",
  as: "general_category",
});

Address.hasMany(Customer, {
  foreignKey: "address_id",
  as: "customers",
});

Customer.belongsTo(Address, {
  foreignKey: "address_id",
  as: "address",
});

Address.hasMany(Supplier, {
  foreignKey: "address_id",
  key: "suppliers",
});

Supplier.belongsTo(Address, {
  foreignKey: "address_id",
  key: "address",
  as: "address",
});

Product.belongsToMany(Supplier, {
  through: ProductSupplier,
  as: "suppliers",
  foreignKey: "product_id",
  otherKey: "supplier_id",
});

Product.belongsTo(Account, {
  foreignKey: "income_account",
  as: "income",
});

Product.belongsTo(Account, {
  foreignKey: "expense_account",
  as: "expense",
});

Supplier.belongsToMany(Product, {
  through: ProductSupplier,
  as: "products",
  foreignKey: "supplier_id",
  otherKey: "product_id",
});

PurchaseOrder.belongsTo(Address, {
  foreignKey: "address_id",
  as: "address",
});

PurchaseOrder.belongsTo(Supplier, {
  foreignKey: "supplier_id",
  as: "supplier",
  onDelete: "CASCADE",
});

ProductSettings.hasMany(ProductDetails, {
  foreignKey: "product_setting_id",
  as: "product_details",
  onDelete: "SET NULL",
});

ProductDetails.belongsTo(ProductSettings, {
  foreignKey: "product_setting_id",
  as: "product_setting",
  onDelete: "NO ACTION",
});

// Product and PhysicalInventory Relations
Product.hasMany(PhysicalInventoryItem, {
  foreignKey: "product_id",
  as: "physical_inventories",
});

PhysicalInventoryItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

// PhysicalInventory and PhysicalInventoryItem Relations
PhysicalInventory.hasMany(PhysicalInventoryItem, {
  foreignKey: "physical_inventory_id",
  as: "items",
  onDelete: "CASCADE",
});

PhysicalInventoryItem.belongsTo(PhysicalInventory, {
  foreignKey: "physical_inventory_id",
  as: "physical_inventory",
});

// PhysicalInventory to User
User.hasMany(PhysicalInventory, {
  foreignKey: "inventory_incharge",
  as: "incharge_physical_inventories",
});

User.hasMany(PhysicalInventory, {
  foreignKey: "branch_manager",
  as: "manager_physical_inventories",
});

PhysicalInventory.belongsTo(User, {
  foreignKey: "inventory_incharge",
  as: "incharge",
});

PhysicalInventory.belongsTo(User, {
  foreignKey: "branch_manager",
  as: "manager",
});

// Branch and Address relationships
Branch.belongsTo(Address, {
  foreignKey: "address_id",
  as: "address",
  onDelete: "NO ACTION",
});

Address.hasMany(Branch, {
  foreignKey: "address_id",
  as: "branches",
  onDelete: "NO ACTION",
});

// Branch and User relationships
Branch.belongsTo(User, {
  foreignKey: "branch_manager",
  as: "manager",
});

// BranchMember relation to users and Branch
Branch.belongsToMany(User, {
  through: BranchMember,
  foreignKey: "branch_id",
  otherKey: "user_id",
  as: "members",
});

BranchMember.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasOne(BranchMember, {
  foreignKey: "user_id",
  as: "branch_member",
});

BranchMember.belongsTo(Branch, {
  foreignKey: "branch_id",
  as: "branch",
});

Branch.hasOne(BranchMember, {
  foreignKey: "branch_id",
  as: "branch_through",
});

StockTransfer.belongsTo(Branch, {
  foreignKey: "branch_to",
  as: "receiver",
});

Branch.hasMany(StockTransfer, {
  foreignKey: "branch_to",
  as: "receives",
});

StockTransfer.belongsTo(Branch, {
  foreignKey: "branch_from",
  as: "sender",
});

Branch.hasMany(StockTransfer, {
  foreignKey: "branch_from",
  as: "sents",
});

StockTransfer.belongsTo(User, {
  foreignKey: "processed_by",
  as: "process_by",
});

StockTransfer.belongsTo(Supplier, {
  foreignKey: "supplier_id",
  as: "supplier",
});

// Product and ProductCategory relationships
Product.belongsToMany(ProductCategory, {
  through: ProductToCategories,
  foreignKey: "product_id",
  otherKey: "category_id",
  as: "categories",
});

ProductCategory.belongsToMany(Product, {
  through: ProductToCategories,
  foreignKey: "category_id",
  otherKey: "product_id",
  as: "products",
});

// Item, Product and Service relationships
Product.hasOne(ProductDetails, {
  foreignKey: "product_id",
  as: "product_details",
});

Product.hasOne(ServiceDetails, {
  foreignKey: "product_id",
  as: "service_details",
});

ProductDetails.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

ServiceDetails.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

// Invoice, Product, InvoiceToProduct, Customer and User Relations
Invoice.belongsToMany(Product, {
  through: InvoiceToProducts,
  foreignKey: "invoice_id",
  otherKey: "product_id",
  as: "products",
});

Product.belongsToMany(Invoice, {
  through: InvoiceToProducts,
  foreignKey: "product_id",
  otherKey: "invoice_id",
  as: "invoices",
});

Invoice.belongsTo(Customer, {
  foreignKey: "customer_id",
  as: "customer",
});

Customer.hasMany(Invoice, {
  foreignKey: "customer_id",
  as: "invoices",
});

Invoice.belongsTo(User, {
  foreignKey: "user_id",
  as: "prepared_by",
});

User.hasMany(Invoice, {
  foreignKey: "user_id",
  as: "invoices",
});

Invoice.belongsTo(SalesOrder, {
  foreignKey: "sales_order_id",
  as: "sales_order",
  onDelete: "SET NULL",
  onUpdate: "SET NULL",
});

// Models that need to be exported for updated associations
module.exports = {
  ProductCategory,
  Supplier,
  Branch,
};
