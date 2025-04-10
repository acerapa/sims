const Router = require("express").Router;
const {
  register,
  all,
  getProducts,
  destroy,
  inventoryStockStatus,
  productItemCode,
  getProduct,
  updateProduct,
  checkItemCodeExist,
} = require("../controllers/Product/ProductController");
const { ProductItemSchema } = require("shared");
const { validateBody } = require("../middleware/request-validator");

const router = Router();

router.delete("/:id", destroy);

router.post("/register", validateBody(ProductItemSchema), register);
router.put("/:id", validateBody(ProductItemSchema.optional()), updateProduct);

router.get("/stock-status", inventoryStockStatus);
router.get("/item-code", productItemCode);
router.post("/check-item-code/:item_code", checkItemCodeExist);
router.get("/:id", getProduct);
router.get("/", getProducts);

module.exports = router;
