const UserEnum = require("./user");
const AccountEnum = require("./account");
const TransferEnum = require("./transfer");
const LocalStorageEnum = require("./local-storage");
const PurchaseOrderEnum = require("./purchase-order");

module.exports = {
  ...UserEnum,
  ...AccountEnum,
  ...TransferEnum,
  ...LocalStorageEnum,
  ...PurchaseOrderEnum,
};
