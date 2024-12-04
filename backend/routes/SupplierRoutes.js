const router = require("express").Router();
const SupplierController = require("../controllers/SupplierController");
const {
  VendorCreateSchema,
  VendorUpdateSchema,
} = require("shared/validators/vendor");
const { validateBody } = require("../middleware/request-validator");

router.get("/all", SupplierController.all);
router.get("/:id", SupplierController.getById);
router.post(
  "/:id/update",
  validateBody(VendorUpdateSchema),
  SupplierController.update
);
router.post(
  "/register",
  validateBody(VendorCreateSchema),
  SupplierController.register
);
router.delete("/delete/:id", SupplierController.delete);

module.exports = router;
