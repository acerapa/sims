const AuthValidators = require("./auth");
const UserValidators = require("./user");
const VendorValidators = require("./vendor");
const AccountValidators = require("./account");
const TransferValidators = require("./transfer");
const PurchaseOrderValidators = require("./purchase-order");

module.exports = {
  ...UserValidators,
  ...AuthValidators,
  ...VendorValidators,
  ...AccountValidators,
  ...TransferValidators,
  ...PurchaseOrderValidators,
};
