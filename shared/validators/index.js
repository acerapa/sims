const AuthValidators = require("./auth");
const UserValidators = require("./user");
const VendorValidators = require("./vendor");
const ProductValidators = require("./product");
const AccountValidators = require("./account");
const TransferValidators = require("./transfer");
const CustomerValidators = require("./customer");
const SalesOrderValidators = require("./sales-order");
const NotificationValidators = require("./notification");
const PurchaseOrderValidators = require("./purchase-order");

const Joi = require("joi");

module.exports = {
  Joi,
  ...UserValidators,
  ...AuthValidators,
  ...VendorValidators,
  ...AccountValidators,
  ...ProductValidators,
  ...TransferValidators,
  ...CustomerValidators,
  ...SalesOrderValidators,
  ...NotificationValidators,
  ...PurchaseOrderValidators,
};
