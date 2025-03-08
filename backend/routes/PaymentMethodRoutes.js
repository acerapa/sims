const router = require("express").Router();
const { PaymentMethodSchema } = require("shared");
const { validateBody } = require("../middleware/request-validator");
const {
  all,
  register,
  getById,
  update,
  destroy,
} = require("../controllers/PaymentMethodController");

router.get("/", all);
router.get("/:id", getById);
router.put("/:id", validateBody(PaymentMethodSchema), update);
router.post("/", validateBody(PaymentMethodSchema), register);
router.delete("/:id", destroy);

module.exports = router;
