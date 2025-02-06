const router = require("express").Router();
const {
  register,
  all,
  getById,
  destroy,
  update,
} = require("../controllers/StockTransferController");
const { validateBody } = require("../middleware/request-validator");
const {
  StockTransferCreateSchema,
  StockTransferUpdateSchema,
} = require("shared");

router.get("/", all);
router.get("/:id", getById);
router.delete("/:id", destroy);
router.post("/register", validateBody(StockTransferCreateSchema), register);
router.put("/:id", validateBody(StockTransferUpdateSchema), update);

module.exports = router;
