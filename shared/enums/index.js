const UserType = Object.freeze({
  ADMIN: "admin",
  MANAGER: "manager",
  SALES_MAN: "sales-man",
  INVENTORY: "inventory",
  CASHIER: "cashier",
});

const UserTypeMap = Object.freeze({
  [UserType.ADMIN]: {
    text: "Admin",
  },
  [UserType.MANAGER]: {
    text: "Manager",
  },
  [UserType.SALES_MAN]: {
    text: "Sales Man",
  },
  [UserType.INVENTORY]: {
    text: "Inventory",
  },
  [UserType.CASHIER]: {
    text: "Cashier",
  },
});

const UserStatus = Object.freeze({
  ACTIVE: 1,
  INACTIVE: 0,
});

const AccountTypes = Object.freeze({
  INCOME: "income",
  EXPENSE: "expense",
  ASSET: "asset",
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
  SURPLUS: "surplus",
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
  ONE_TIME: "one-time",
  INSTALLMENT: "installment",
});

const SalesOrderTypeMap = Object.freeze({
  [SalesOrderType.ONE_TIME]: {
    text: "One-Time",
    class: "sales-types-one-time",
  },
  [SalesOrderType.INSTALLMENT]: {
    text: "Installment",
    class: "sales-types-installment",
  },
});

const SalesOrderStatus = Object.freeze({
  OPEN: "open",
  INVOICED: "invoiced",
  CANCELLED: "cancelled",
});

const SalesOrderStatusMap = Object.freeze({
  [SalesOrderStatus.OPEN]: {
    text: "Open",
    class: "purchase-status-open",
  },
  [SalesOrderStatus.INVOICED]: {
    text: "Invoiced",
    class: "purchase-status-completed",
  },
  [SalesOrderStatus.CANCELLED]: {
    text: "Cancelled",
    class: "purchase-status-cancelled",
  },
});

const NotificationStatus = Object.freeze({
  UNREAD: "unread",
  READ: "read",
});

const NotificationType = Object.freeze({
  GENERAL: "general",
  PRODUCT: "product",
  SALES_ORDER: "sales-order",
  PURCHASE_ORDER: "purchase-order",
});

const ConsoleColors = {
  RED: "\x1b[31m",
  BLUE: "\x1b[34m",
  GREEN: "\x1b[32m",
  RESET: "\x1b[0m",
  YELLOW: "\x1b[33m",
};

const InvoiceStatus = Object.freeze({
  UNPAID: "unpaid",
  PAID: "paid",
  PARTIALLY_PAID: "partially-paid",
  OVERDUE: "overdue",
  REFUNDED: "refunded",
  FAILED: "failed",
  DISPUTED: "disputed",
});

const InvoiceStatusMap = Object.freeze({
  [InvoiceStatus.UNPAID]: {
    text: "Unpaid",
    class: "invoice-unpaid",
  },
  [InvoiceStatus.PAID]: {
    text: "Paid",
    class: "invoice-paid",
  },
  [InvoiceStatus.PARTIALLY_PAID]: {
    text: "Partially Paid",
    class: "invoice-partially-paid",
  },
  [InvoiceStatus.OVERDUE]: {
    text: "Overdue",
    class: "invoice-overdue",
  },
  [InvoiceStatus.REFUNDED]: {
    text: "Refunded",
    class: "invoice-refunded",
  },
  [InvoiceStatus.FAILED]: {
    text: "Failed",
    class: "invoice-failed",
  },
  [InvoiceStatus.DISPUTED]: {
    text: "Disputed",
    class: "invoice-disputed",
  },
});

const DeliveryStatus = Object.freeze({
  PENDING: "pending",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
});

const DeliveryStatusMap = Object.freeze({
  [DeliveryStatus.PENDING]: {
    text: "Pending",
    class: "delivery-status-pending",
  },
  [DeliveryStatus.DELIVERED]: {
    text: "Delivered",
    class: "delivery-status-delivered",
  },
  [DeliveryStatus.CANCELLED]: {
    text: "Cancelled",
    class: "delivery-status-cancelled",
  },
});

module.exports = {
  UserType,
  ItemType,
  UserStatus,
  UserTypeMap,
  ProductType,
  AccountTypes,
  BranchStatus,
  TransferType,
  ProductStatus,
  ConsoleColors,
  InvoiceStatus,
  SalesOrderType,
  DeliveryStatus,
  BranchStatusMap,
  SalesOrderStatus,
  NotificationType,
  InvoiceStatusMap,
  PurchaseOrderType,
  DeliveryStatusMap,
  PurchaseStatusMap,
  SalesOrderTypeMap,
  NotificationStatus,
  StockTransferStatus,
  PurchaseOrderStatus,
  SalesOrderStatusMap,
  ProductOrderedStatus,
  ProductTransferStatus,
  StockTransferStatusMap,
  PhysicalInventoryStatus,
  PhysicalInventoryStatusMap,
};
