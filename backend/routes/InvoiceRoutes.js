const {
  all,
  register,
  byId,
  update,
} = require("../controllers/InvoiceController");

const router = require("express").Router();

const { InvoiceWithProductsSchema } = require("shared");
const { validateBody } = require("../middleware/request-validator");

router.get("/", all);
router.get("/:id", byId);

router.put("/:id", validateBody(InvoiceWithProductsSchema), update);

router.post("/", validateBody(InvoiceWithProductsSchema), register);

module.exports = router;
