const { all, register } = require("../controllers/ReceivedPaymentsController");
const { validateBody } = require("../middleware/request-validator");
const { ReceivePaymentsSchema } = require("shared");

const router = require("express").Router();

router.get("/", all);

router.post("/", validateBody(ReceivePaymentsSchema), register);

module.exports = router;
