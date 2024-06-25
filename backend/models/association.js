const Address = require("./address");
const Product = require("./product");
const Supplier = require("./supplier");
const ProductSupplier = require("./product-supplier");
const ProductCategory = require("./product-category");

Supplier.hasOne(Address, {
  foreignKey: "id",
  as: "address",
  onDelete: "CASCADE",
});
Address.belongsTo(Supplier, { as: "supplier", onDelete: "NO ACTION" });

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
