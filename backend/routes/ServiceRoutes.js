const router = require("express").Router();
const {
  register,
  getServices,
  getService,
  destroy,
  updateService,
} = require("../controllers/Product/ServiceController");
const { validateBody } = require("../middleware/request-validator");
const { ServiceItemSchema } = require("shared");

router.get("/", getServices);
router.get("/:id", getService);
router.delete("/:id", destroy);
router.post("/register", validateBody(ServiceItemSchema), register);
router.put("/:id", validateBody(ServiceItemSchema.optional()), updateService);

module.exports = router;
