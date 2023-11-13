const { signUp, signIn, me } = require("./auth.service");
const AuthRouter = require("./auth.route");

module.exports = {
  signUp,
  signIn,
  me,
  AuthRouter,
};
