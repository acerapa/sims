const {
  all,
  register,
  byId,
  latestPaymentByInvoiceId,
  paymentsByInvoiceId,
} = require("../controllers/ReceivedPaymentsController");
const { validateBody } = require("../middleware/request-validator");
const { ReceivePaymentsSchema } = require("shared");

const router = require("express").Router();

router.get("/", all);
router.get("/:id", byId);
router.get("/invoice/:invoice_id", paymentsByInvoiceId);
router.get("/invoice/:invoice_id/latest", latestPaymentByInvoiceId);

router.post("/", validateBody(ReceivePaymentsSchema), register);

module.exports = router;
