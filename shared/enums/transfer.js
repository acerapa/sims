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
});

const ProductTransferStatus = Object.freeze({
  OPEN: "open",
  COMPLETE: "complete",
  INCOMPLETE: "incomplete",
  NOT_RECEIVED: "not-received",
});

module.exports = {
  BranchStatus,
  TransferType,
  BranchStatusMap,
  ProductTransferStatus,
};
