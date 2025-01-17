const router = require("express").Router();
const ProductController = require("../controllers/ProductController");
const { ProductSchema } = require("shared");
const { validateBody } = require("../middleware/request-validator");

router.get("/all", ProductController.all);
router.post("/update/:id", ProductController.update);
router.get("/products", ProductController.getProducts);
router.get("/services", ProductController.getServices);
router.post(
  "/register",
  validateBody(ProductSchema, false),
  ProductController.register
);
router.delete("/delete/:id", ProductController.delete);
router.get("/item-code", ProductController.productItemCode);
router.get("/stock-status", ProductController.inventoryStockStatus);

module.exports = router;
