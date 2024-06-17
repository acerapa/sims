const Address = require("./address");
const Product = require("./product");
const Supplier = require("./supplier");
const ProductSupplier = require('./product-supplier');


Supplier.hasOne(Address, { foreignKey: "id", as: "address", onDelete: 'CASCADE' });
Address.belongsTo(Supplier, { as: "supplier", onDelete: 'NO ACTION' });

Product.hasOne(ProductSupplier, {
	foreignKey: 'product_id'
});

Supplier.hasMany(ProductSupplier, {
	foreignKey: 'supplier_id'
});
