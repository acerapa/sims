const Router = require("express").Router;
const ProductController = require("../controllers/ProductController");
const { ProductSchema } = require("shared");
const { validateBody } = require("../middleware/request-validator");

const router = Router();
const productRoute = Router();
const serviceRoute = Router();

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
router.get("/stock-status", ProductController.inventoryStockStatus);

productRoute.get("/item-code", ProductController.productItemCode);

router.use("/products", productRoute);
router.use("/services", serviceRoute);

module.exports = router;
