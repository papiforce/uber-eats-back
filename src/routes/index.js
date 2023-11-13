const router = require("express").Router();
const { AuthRouter } = require("../auth");
const { UsersRouter } = require("../users");

router.use("/auth", AuthRouter);
router.use("/users", UsersRouter);

module.exports = router;
