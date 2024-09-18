const router = require("express").Router();
const {
  PhysicalInventoryCreateSchema,
  PhysicalInventoryUpdateSchema,
  PhysicalInventoryItemUpdateSchema,
} = require("shared/validators/purchase-order");
const { validateBody } = require("../middleware/request-validator");
const {
  all,
  register,
  getOne,
  destroy,
  updateItem,
  update,
} = require("../controllers/PhysicalInventoryController");

router.get("/all", all);
router.get("/:id", getOne);
router.delete("/delete", destroy);
router.post("/update/:id", validateBody(PhysicalInventoryUpdateSchema), update);
router.post("/register", validateBody(PhysicalInventoryCreateSchema), register);
router.post(
  "/item/:id",
  validateBody(PhysicalInventoryItemUpdateSchema),
  updateItem
);

module.exports = router;
