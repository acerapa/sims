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
  getProductByIds,
} = require("../controllers/Product/ProductController");
const { ProductItemSchema } = require("shared");
const { validateBody } = require("../middleware/request-validator");

const router = Router();

router.get("/by-ids", getProductByIds);
router.get("/stock-status", inventoryStockStatus);
router.get("/item-code", productItemCode);
router.get("/:id", getProduct);
router.get("/", getProducts);

router.put("/:id", validateBody(ProductItemSchema.optional()), updateProduct);

router.post("/register", validateBody(ProductItemSchema), register);
router.post("/check-item-code/:item_code", checkItemCodeExist);

router.delete("/:id", destroy);

module.exports = router;
