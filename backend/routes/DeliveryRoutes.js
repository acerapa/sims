const router = require("express").Router();
const { validateBody } = require("../middleware/request-validator");
const {
  all,
  byId,
  updateStatus,
} = require("../controllers/DeliveryController");
const { DeliveryStatusSchema } = require("shared");

router.get("/", all);
router.get("/:id", byId);
router.patch("/:id/status", validateBody(DeliveryStatusSchema), updateStatus);

module.exports = router;
