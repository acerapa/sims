const User = require("./user");
const Address = require("./address");
const Account = require("./account");
const Product = require("./product");
const Supplier = require("./supplier");
const ProductOrder = require("./product-order");
const PurchaseOrder = require("./purchase-order");
const ProductSettings = require("./product-setting");
const ProductSupplier = require("./product-supplier");
const ProductCategory = require("./product-category");
const PhysicalInventory = require("./physical-inventory");
const PhysicalInventoryItem = require("./physical-inventory-item");

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
  through: ProductOrder,
  foreignKey: "product_id",
  otherKey: "order_id",
});

PurchaseOrder.belongsToMany(Product, {
  through: ProductOrder,
  foreignKey: "order_id",
  otherKey: "product_id",
  onDelete: "NO ACTION",
  as: "products",
});

PurchaseOrder.belongsTo(Address, {
  foreignKey: "address_id",
  as: "address",
});

// Product Order and Product Relationships
Product.hasMany(ProductOrder, {
  foreignKey: "product_id",
  as: "product_orders",
  onDelete: "CASCADE",
});

ProductOrder.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
  onDelete: "CASCADE",
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
