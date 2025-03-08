const router = require("express").Router();
const { PaymentMethodSchema } = require("shared");
const { validateBody } = require("../middleware/request-validator");
const { all, register } = require("../controllers/PaymentMethodController");

router.get("/", all);
router.post("/", validateBody(PaymentMethodSchema), register);

module.exports = router;
