const UserModel = require("./users.model");
const { logDisplayer } = require("../utils");

/**
 * GET - Users list
 * @queryParam { 
    id?: ObjectId
    onlyActive?: "true"
    search?: string 
    withoutFounder?: boolean
    limit?: number (default: 10)
    page?: number
  }
 *
 * @return Users[] | []
 */

const get = async (req, res) => {
  try {
    const { id, onlyActive, search, limit = 10, page } = req.query;

    const users = await UserModel.find({
      ...(id && { _id: id }),
      ...(onlyActive && { isDelete: false }),
      ...(search && {
        $or: [
          { firstname: { $regex: search, $options: "i" } },
          { lastname: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }),
    })
      .limit(limit)
      .skip(limit * page);

    logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

    return res.json(users);
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(500).send(error);
  }
};

/**
 * PUT - User
 * @param { username?: string, email?: string, description?: string }
 *
 * @return User
 */

const updateUserProfile = async (req, res) => {
  try {
    if (!req.user._id.equals(req.params.userId) && req.user.role !== "ADMIN")
      return res
        .status(401)
        .json({ error: "Vous n'êtes pas autorisé à effectuer cette action" });

    const user = await UserModel.findById(req.params.userId);

    if (!user)
      return res.status(404).json({ error: "Cet utilisateur n'existe pas" });

    const checkEmail = await UserModel.findOne({ email: user.email });

    if (checkEmail && req.user.email !== user.email) {
      return res.status(403).json({ error: "Cette email est déjà utilisée" });
    }

    const getcoordinates = await axios.get(
      "https://api-adresse.data.gouv.fr/search/",
      {
        params: {
          q: req.body.address,
        },
      }
    );

    const coordinates = getcoordinates.data.features[0].geometry.coordinates;

    const updatedUser = Object.assign(user, {
      ...req.body,
      role:
        req.user.role === "ADMIN" && req.body.role ? req.body.role : user.role,
      address: {
        address: req.body.address,
        coordonates: {
          lat: coordinates[1],
          long: coordinates[0],
        },
      },
    });

    await updatedUser.save();

    logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

    return res.json(updatedUser);
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(500).send(error);
  }
};

module.exports = {
  get,
  updateUserProfile,
};
