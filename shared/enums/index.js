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

const StockTransferStatus = Object.freeze({
  OPEN: "open",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

const StockTransferStatusMap = Object.freeze({
  [StockTransferStatus.OPEN]: {
    text: "Open",
    class: "purchase-status-open",
  },
  [StockTransferStatus.COMPLETED]: {
    text: "Completed",
    class: "purchase-status-completed",
  },
  [StockTransferStatus.CANCELLED]: {
    text: "Cancelled",
    class: "purchase-status-cancelled",
  },
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

const ItemType = Object.freeze({
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

const SalesOrderTypeMap = Object.freeze({
  [SalesOrderType.CASH]: {
    text: "Cash",
    class: "sales-types-cash",
  },
  [SalesOrderType.INSTALLMENT]: {
    text: "Installment",
    class: "sales-types-installment",
  },
});

const SalesOrderStatus = Object.freeze({
  OPEN: "open",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  OVERDUE: "overdue",
});

const SalesOrderStatusMap = Object.freeze({
  [SalesOrderStatus.OPEN]: {
    text: "Open",
    class: "purchase-status-open",
  },
  [SalesOrderStatus.CONFIRMED]: {
    text: "Confirmed",
    class: "purchase-status-confirmed",
  },
  [SalesOrderStatus.COMPLETED]: {
    text: "Completed",
    class: "purchase-status-completed",
  },
  [SalesOrderStatus.CANCELLED]: {
    text: "Cancelled",
    class: "purchase-status-cancelled",
  },
  [SalesOrderStatus.OVERDUE]: {
    text: "Overdue",
    class: "purchase-status-overdue",
  },
});

const ConsoleColors = {
  RED: "\x1b[31m",
  BLUE: "\x1b[34m",
  GREEN: "\x1b[32m",
  RESET: "\x1b[0m",
  YELLOW: "\x1b[33m",
};

module.exports = {
  UserType,
  ItemType,
  ProductType,
  AccountTypes,
  BranchStatus,
  TransferType,
  ProductStatus,
  ConsoleColors,
  SalesOrderType,
  BranchStatusMap,
  LocalStorageKeys,
  SalesOrderStatus,
  PurchaseOrderType,
  PurchaseStatusMap,
  SalesOrderTypeMap,
  StockTransferStatus,
  PurchaseOrderStatus,
  SalesOrderStatusMap,
  ProductOrderedStatus,
  ProductTransferStatus,
  StockTransferStatusMap,
  PhysicalInventoryStatus,
  PhysicalInventoryStatusMap,
};
