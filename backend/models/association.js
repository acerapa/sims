const Address = require("./address");
const Account = require("./account");
const Product = require("./product");
const Supplier = require("./supplier");
const ProductSupplier = require("./product-supplier");
const ProductCategory = require("./product-category");
const ProductOrder = require("./product-order");
const PurchaseOrder = require("./purchase-order");
const ProductSettings = require("./product-setting");

Supplier.hasOne(Address, {
  foreignKey: "supplier_id",
  as: "address",
  onDelete: "CASCADE",
});

Address.belongsTo(Supplier, {
  foreignKey: "supplier_id",
  as: "supplier",
  onDelete: "NO ACTION",
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

PurchaseOrder.belongsTo(Supplier, {
  foreignKey: "supplier_id",
  as: "supplier",
  onDelete: "CASCADE",
});

PurchaseOrder.hasOne(Address, {
  foreignKey: "order_id",
  as: "address",
  onDelete: "CASCADE",
});

Product.hasOne(ProductSettings, {
  foreignKey: "product_id",
  as: "setting",
  onDelete: "CASCADE",
});

ProductSettings.belongsTo(Product, {
  foreignKey: "product_id",
  as: "setting",
  onDelete: "NO ACTION",
});

module.exports = {
  Supplier,
};
