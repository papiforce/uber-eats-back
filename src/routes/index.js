const router = require("express").Router();
const { AuthRouter } = require("../auth");
const { UsersRouter } = require("../users");
const { MealRouter } = require("../meals");
const { OrderRouter } = require("../orders");

router.use("/auth", AuthRouter);
router.use("/users", UsersRouter);
router.use("/meals", MealRouter);
router.use("/orders", OrderRouter);

module.exports = router;
