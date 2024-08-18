const UserEnum = require("./user");
const AccountEnum = require("./account");
const LocalStorageEnum = require("./local-storage");
const PurchaseOrderEnum = require("./purchase-order");

module.exports = {
  ...UserEnum,
  ...AccountEnum,
  ...LocalStorageEnum,
  ...PurchaseOrderEnum,
};
