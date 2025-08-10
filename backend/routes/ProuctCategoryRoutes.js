const router = require("express").Router();
const ProductCategoryController = require("../controllers/ProductCategoryController");

router.get("/all", ProductCategoryController.all);
router.get("/:id", ProductCategoryController.byId);
router.get("/category-tree/:id", ProductCategoryController.getParent);

router.put("/:id", ProductCategoryController.update);
router.post("/register", ProductCategoryController.register);
router.delete("/delete/:id", ProductCategoryController.delete);

module.exports = router;
