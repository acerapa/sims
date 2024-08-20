const PurchaseOrderStatus = Object.freeze({
  OPEN: "open",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
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

module.exports = {
  PurchaseOrderType,
  PurchaseStatusMap,
  PurchaseOrderStatus,
  ProductOrderedStatus,
};
