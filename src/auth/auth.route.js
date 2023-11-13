const router = require("express").Router();
const { signUp, signIn, me } = require("./auth.service");
const { isLogged } = require("../middlewares");

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/me", isLogged, me);

module.exports = router;
