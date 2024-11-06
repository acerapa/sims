const router = require("express").Router();
const {
  register,
  getAllByType,
  getById,
  destroy,
} = require("../controllers/StockTransferController");
const { validateBody } = require("../middleware/request-validator");
const { BranchTransferCreateSchema } = require("shared/validators/transfer");

router.get("/:id", getById);
router.delete("/:id", destroy);
router.get("/all/:type", getAllByType);
router.post("/register", validateBody(BranchTransferCreateSchema), register);

module.exports = router;
