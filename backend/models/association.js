const Supplier = require("./supplier");
const Address = require("./address");

Supplier.hasOne(Address, { foreignKey: "id", as: "address", onDelete: 'CASCADE' });
Address.belongsTo(Supplier, { as: "supplier", onDelete: 'NO ACTION' });
