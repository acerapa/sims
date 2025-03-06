const { testNotification } = require("../controllers/TestingController");

const router = require("express").Router();

router.get("/notification", testNotification);

module.exports = router;
