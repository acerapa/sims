const { all, register } = require("../controllers/InvoiceController");

const router = require("express").Router();

router.get("/", all);

router.post("/", register);

module.exports = router;
