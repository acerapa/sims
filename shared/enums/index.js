// const UserEnum = require("./user");
// const AccountEnum = require("./account");
// const TransferEnum = require("./transfer");
// const LocalStorageEnum = require("./local-storage");
// const PurchaseOrderEnum = require("./purchase-order");

// module.exports = {
//   ...UserEnum,
//   ...AccountEnum,
//   ...TransferEnum,
//   ...LocalStorageEnum,
//   ...PurchaseOrderEnum,
// };

const UserType = Object.freeze({
  ADMIN: "admin",
  MANAGER: "manager",
  SALES_MAN: "sales-man",
  INVENTORY: "inventory",
  CASHIER: "cashier",
});

const AccountTypes = Object.freeze({
  INCOME: "income",
  EXPENSE: "expense",
  ASSET: "asset",
});

const LocalStorageKeys = Object.freeze({
  ACCESS: "sims-access",
  REFRESH: "sims-refresh",
  CURRENT_USER: "sims-current-user",
});

const PurchaseOrderStatus = Object.freeze({
  OPEN: "open",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  OVERDUE: "overdue",
});

const ProductOrderedStatus = Object.freeze({
  OPEN: "open",
  COMPLETE: "complete",
  INCOMPLETE: "incomplete",
  NOT_RECEIVED: "not-received",
});

const PurchaseOrderType = Object.freeze({
  TERM: "term",
  COD: "cod",
});

const PhysicalInventoryStatus = Object.freeze({
  DRAFT: "draft",
  DONE: "done",
});

const PurchaseStatusMap = Object.freeze({
  [PurchaseOrderStatus.OPEN]: {
    text: "Open",
    class: "purchase-status-open",
  },
  [PurchaseOrderStatus.CONFIRMED]: {
    text: "Confirmed",
    class: "purchase-status-confirmed",
  },
  [PurchaseOrderStatus.COMPLETED]: {
    text: "Completed",
    class: "purchase-status-completed",
  },
  [PurchaseOrderStatus.CANCELLED]: {
    text: "Cancelled",
    class: "purchase-status-cancelled",
  },
});

const PhysicalInventoryStatusMap = {
  [PhysicalInventoryStatus.DRAFT]: {
    text: "Draft",
    class: "draft",
  },
  [PhysicalInventoryStatus.DONE]: {
    text: "Done",
    class: "done",
  },
};

const BranchStatus = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
});

const BranchStatusMap = Object.freeze({
  [BranchStatus.ACTIVE]: {
    text: "Active",
    class: "done",
  },
  [BranchStatus.INACTIVE]: {
    text: "Inactive",
    class: "draft",
  },
});

const TransferType = Object.freeze({
  IBRR: "ibrr",
  STR: "str",
  RMA: "rma",
  FIX: "fix",
});

const ProductTransferStatus = Object.freeze({
  OPEN: "open",
  COMPLETE: "complete",
  INCOMPLETE: "incomplete",
  NOT_RECEIVED: "not-received",
});

const ProductType = Object.freeze({
  INVENTORY: "inventory",
  NON_INVENTORY: "non-inventory",
});

const ProductStatus = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
});

const SalesOrderType = Object.freeze({
  CASH: "cash",
  INSTALLMENT: "installment",
});

module.exports = {
  UserType,
  ProductType,
  AccountTypes,
  BranchStatus,
  TransferType,
  ProductStatus,
  SalesOrderType,
  BranchStatusMap,
  LocalStorageKeys,
  PurchaseOrderType,
  PurchaseStatusMap,
  PurchaseOrderStatus,
  ProductOrderedStatus,
  ProductTransferStatus,
  PhysicalInventoryStatus,
  PhysicalInventoryStatusMap,
};
