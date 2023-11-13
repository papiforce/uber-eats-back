const router = require("express").Router();
const { AuthRouter } = require("../auth");
const { UsersRouter } = require("../users");
const { MealRouter } = require("../meals");

router.use("/auth", AuthRouter);
router.use("/users", UsersRouter);
router.use("/meals", MealRouter);

module.exports = router;
