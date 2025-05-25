const { all, register, byId } = require("../controllers/InvoiceController");

const router = require("express").Router();

const { InvoiceWithProductsSchema } = require("shared");
const { validateBody } = require("../middleware/request-validator");

router.get("/", all);
router.get("/:id", byId);

router.post("/", validateBody(InvoiceWithProductsSchema, true, true), register);

module.exports = router;
