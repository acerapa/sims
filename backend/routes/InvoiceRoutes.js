const { all, register } = require("../controllers/InvoiceController");

const router = require("express").Router();

const { InvoiceWithProductsSchema } = require("shared");
const { validateBody } = require("../middleware/request-validator");

router.get("/", all);

router.post("/", validateBody(InvoiceWithProductsSchema), register);

module.exports = router;
