const Address = require("./address");
const Product = require("./product");
const Supplier = require("./supplier");
const ProductSupplier = require("./product-supplier");
const ProductCategory = require("./product-category");
const ProductOrder = require("./product-order");
const PurchaseOrder = require("./purchase-order");

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
});

Supplier.belongsToMany(Product, {
  through: ProductSupplier,
  as: "products",
  foreignKey: "supplier_id",
});

Product.belongsTo(ProductCategory, {
  foreignKey: "id",
  as: "category",
  onDelete: "CASCADE",
});

ProductCategory.hasMany(Product, {
  foreignKey: "category_id",
  as: "products",
  onDelete: "NO ACTION",
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
});

PurchaseOrder.belongsTo(Supplier, {
  foreignKey: "supplier_id",
  as: "supplier",
  onDelete: "NO ACTION",
});

PurchaseOrder.hasOne(Address, {
  foreignKey: "order_id",
  as: "address",
  onDelete: 'CASCADE'
});
