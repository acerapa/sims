const router = require("express").Router();
const SupplierController = require("../controllers/SupplierController");

router.get("/all", SupplierController.all);
router.post("/update", SupplierController.update);
router.post("/register", SupplierController.register);
router.delete("/delete/:id", SupplierController.delete);

module.exports = router;
