const Router = require("express").Router;
const {
  register,
  all,
  update,
  getProducts,
  getServices,
  destroy,
  inventoryStockStatus,
  productItemCode,
  getProduct,
} = require("../controllers/ProductController");
const { ProductItemSchema } = require("shared");
const { validateBody } = require("../middleware/request-validator");

const router = Router();
const productRoute = Router();
const serviceRoute = Router();

router.get("/all", all);
router.post("/update/:id", update);
router.get("/products", getProducts);
router.get("/services", getServices);

router.delete("/delete/:id", destroy);
router.get("/stock-status", inventoryStockStatus);

productRoute.post("/register", validateBody(ProductItemSchema), register);
productRoute.get("/item-code", productItemCode);
productRoute.get("/:id", getProduct);

router.use("/products", productRoute);
router.use("/services", serviceRoute);

module.exports = router;
