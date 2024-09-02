const router = require("express").Router();
const { PhysicalInventorySchema } = require("shared/validators/purchase-order");
const { validateBody } = require("../middleware/request-validator");
const {
  all,
  register,
  getOne,
} = require("../controllers/PhysicalInventoryController");

router.get("/all", all);
router.get("/:id", getOne);
router.post("/register", validateBody(PhysicalInventorySchema), register);

module.exports = router;
