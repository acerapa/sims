const {
  all,
  register,
  byId,
} = require("../controllers/ReceivedPaymentsController");
const { validateBody } = require("../middleware/request-validator");
const { ReceivePaymentsSchema } = require("shared");

const router = require("express").Router();

router.get("/", all);
router.get("/:id", byId);

router.post("/", validateBody(ReceivePaymentsSchema), register);

module.exports = router;
