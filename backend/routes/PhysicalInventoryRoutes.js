const router = require("express").Router();
const { all, register } = require("../controllers/PhysicalInventoryController");
const { PhysicalInventorySchema } = require("shared/validators/purchase-order");
const { validateBody } = require("../middleware/request-validator");

router.get("/all", all);
router.post("/register", validateBody(PhysicalInventorySchema), register);

module.exports = router;
