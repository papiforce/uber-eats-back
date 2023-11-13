const router = require("express").Router();
const { get, updateUserProfile } = require("./users.service");
const { isLogged } = require("../middlewares");

router.get("/", get);
router.put("/update/:userId", isLogged, updateUserProfile);

module.exports = router;
