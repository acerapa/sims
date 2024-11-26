const router = require("express").Router();
const SupplierController = require("../controllers/SupplierController");
const { VendorCreateSchema } = require("shared/validators/vendor");
const { validateBody } = require("../middleware/request-validator");

router.get("/all", SupplierController.all);
router.post("/update", SupplierController.update);
router.post(
  "/register",
  validateBody(VendorCreateSchema),
  SupplierController.register
);
router.delete("/delete/:id", SupplierController.delete);

module.exports = router;
