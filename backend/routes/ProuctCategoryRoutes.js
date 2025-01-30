const router = require("express").Router();
const ProductCategoryController = require("../controllers/ProductCategoryController");

router.get("/all", ProductCategoryController.all);
router.put("/:id", ProductCategoryController.update);
router.delete("/delete/:id", ProductCategoryController.delete);
router.post("/register", ProductCategoryController.register);

module.exports = router;
