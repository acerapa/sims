const AuthValidators = require("./auth");
const UserValidators = require("./user");
const VendorValidators = require("./vendor");
const ProductValidators = require("./product");
const AccountValidators = require("./account");
const InvoiceValidators = require("./invoice");
const TransferValidators = require("./transfer");
const CustomerValidators = require("./customer");
const DeliveryValidators = require("./delivery");
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
  ...InvoiceValidators,
  ...TransferValidators,
  ...CustomerValidators,
  ...DeliveryValidators,
  ...SalesOrderValidators,
  ...NotificationValidators,
  ...PurchaseOrderValidators,
};
