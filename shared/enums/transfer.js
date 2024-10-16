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

module.exports = {
  BranchStatus,
  BranchStatusMap,
};
