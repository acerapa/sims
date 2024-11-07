const router = require("express").Router();
const {
  register,
  all,
  getById,
  destroy,
} = require("../controllers/StockTransferController");
const { validateBody } = require("../middleware/request-validator");
const { StockTransferCreateSchema } = require("shared/validators/transfer");

router.get("/", all);
router.get("/:id", getById);
router.delete("/:id", destroy);
router.post("/register", validateBody(StockTransferCreateSchema), register);

module.exports = router;
