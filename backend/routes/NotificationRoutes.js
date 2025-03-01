const { NotificationSchema } = require("shared/validators/notification");
const {
  all,
  register,
  update,
} = require("../controllers/NotificationController");
const { validateBody } = require("../middleware/request-validator");

const router = require("express").Router();

router.get("/", all);

router.post("/", validateBody(NotificationSchema), register);

router.put("/:id", validateBody(NotificationSchema), update);

module.exports = router;
