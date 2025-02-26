const { SalesOrderCreateSchema } = require("shared/validators/sales-order");
const {
  all,
  register,
  byId,
  destroy,
  update,
} = require("../controllers/SalesOrderController");
const { validateBody } = require("../middleware/request-validator");

const router = require("express").Router();

router.get("/all", all);
router.get("/:id", byId);

router.delete("/:id", destroy);

router.put("/:id", validateBody(SalesOrderCreateSchema), update);

router.post("/register", validateBody(SalesOrderCreateSchema), register);

module.exports = router;
