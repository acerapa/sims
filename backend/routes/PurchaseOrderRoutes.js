const Router = require("express").Router();
const PurchaseOrderController = require("../controllers/PurchaseOrderController");
const { validateBody } = require("../middleware/request-validator");
const {
  PurchaseOrderCreationSchema,
  PurchaseOrderUpdateSchema,
} = require("shared");

Router.get("/all", PurchaseOrderController.all);
Router.get("/:id", PurchaseOrderController.byId);
Router.delete("/delete", PurchaseOrderController.delete);
Router.post(
  "/:id/update",
  validateBody(PurchaseOrderUpdateSchema),
  PurchaseOrderController.update
);
Router.post(
  "/register",
  validateBody(PurchaseOrderCreationSchema),
  PurchaseOrderController.register
);

module.exports = Router;
