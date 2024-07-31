export const PurchaseOrderStatus = Object.freeze({
  OPEN: "open",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

export const PurchaseStatusMap = Object.freeze({
  [PurchaseOrderStatus.OPEN]: {
    text: "Open",
    class: "bg-blue-500 text-blue-500",
  },
  [PurchaseOrderStatus.CONFIRMED]: {
    text: "Confirmed",
    class: "bg-yellow-500 text-yellow-500",
  },
  [PurchaseOrderStatus.COMPLETED]: {
    text: "Completed",
    class: "bg-success text-success",
  },
  [PurchaseOrderStatus.CANCELLED]: {
    text: "Cancelled",
    class: "bg-gray-500 text-gray-500",
  },
});
