const { SalesOrderCreateSchema } = require("shared/validators/sales-order");
const { all, register } = require("../controllers/SalesOrderController");
const { validateBody } = require("../middleware/request-validator");

const router = require("express").Router();

router.get("/all", all);
router.post("/register", validateBody(SalesOrderCreateSchema), register);

module.exports = router;
