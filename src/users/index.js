const UserModel = require("./users.model");
const { get, updateUserProfile } = require("./users.service");
const UsersRouter = require("./users.route");

module.exports = {
  UserModel,
  UsersRouter,
  get,
  updateUserProfile,
};
