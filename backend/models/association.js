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
const ProductSettings = require("./product-setting");
const ProductSupplier = require("./product-supplier");
const ProductCategory = require("./product-category");
const PhysicalInventory = require("./physical-inventory");
const ProductTransaction = require("./product-transaction");
const PhysicalInventoryItem = require("./physical-inventory-item");

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

Product.belongsTo(ProductCategory, {
  foreignKey: "category_id",
  as: "category",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

ProductCategory.hasMany(Product, {
  foreignKey: "category_id",
  as: "products",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.belongsToMany(PurchaseOrder, {
  through: ProductTransaction,
  foreignKey: "product_id",
  otherKey: "transfer_id",
  as: "orders",
});

PurchaseOrder.belongsToMany(Product, {
  through: ProductTransaction,
  foreignKey: "transfer_id",
  otherKey: "product_id",
  as: "products",
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

ProductSettings.hasMany(Product, {
  foreignKey: "product_setting_id",
  as: "products",
  onDelete: "SET NULL",
});

Product.belongsTo(ProductSettings, {
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

module.exports = {
  Supplier,
};

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

// Stock transfer version
StockTransfer.belongsToMany(Product, {
  through: ProductTransaction,
  foreignKey: "transfer_id",
  otherKey: "product_id",
  as: "products",
});

Product.belongsToMany(StockTransfer, {
  through: ProductTransaction,
  foreignKey: "product_id",
  otherKey: "transfer_id",
  as: "transfers",
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
