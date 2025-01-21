const router = require("express").Router();
const {
  register,
  getServices,
  getService,
} = require("../controllers/Product/ServiceController");
const { validateBody } = require("../middleware/request-validator");
const { ServiceItemSchema } = require("shared");

router.get("/", getServices);
router.get("/:id", getService);
router.post("/register", validateBody(ServiceItemSchema), register);

module.exports = router;
