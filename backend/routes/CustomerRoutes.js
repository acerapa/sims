const { CustomerSchema } = require("shared");
const {
  all,
  register,
  byId,
  update,
  destroy,
} = require("../controllers/CustomerController");
const { validateBody } = require("../middleware/request-validator");

const router = require("express").Router();

router.get("/all", all);
router.get("/:id", byId);
router.delete("/:id/delete", destroy);
router.post("/register", validateBody(CustomerSchema), register);
router.post("/:id/update", validateBody(CustomerSchema), update);

module.exports = router;
