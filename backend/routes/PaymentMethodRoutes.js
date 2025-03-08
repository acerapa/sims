const router = require("express").Router();
const { PaymentMethodSchema } = require("shared");
const { validateBody } = require("../middleware/request-validator");
const {
  all,
  register,
  getById,
  update,
} = require("../controllers/PaymentMethodController");

router.get("/", all);
router.get("/:id", getById);
router.put("/:id", validateBody(PaymentMethodSchema), update);
router.post("/", validateBody(PaymentMethodSchema), register);

module.exports = router;
