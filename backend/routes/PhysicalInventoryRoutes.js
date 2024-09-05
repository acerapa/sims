const router = require("express").Router();
const { PhysicalInventoryCreateSchema } = require("shared/validators/purchase-order");
const { validateBody } = require("../middleware/request-validator");
const {
  all,
  register,
  getOne,
  destroy,
} = require("../controllers/PhysicalInventoryController");

router.get("/all", all);
router.get("/:id", getOne);
router.delete("/delete", destroy);
router.post("/register", validateBody(PhysicalInventoryCreateSchema), register);

module.exports = router;
