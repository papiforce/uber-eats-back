const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../users/users.model");
const { logDisplayer } = require("../utils");

/**
 * POST - Sign up
 * @param { firstname: string, lastname: string, address: string, email: string, password: string }
 *
 * @return { success: boolean }
 */

const signUp = async (req, res) => {
  try {
    const { firstname, lastname, email, password, address } = req.body;

    const userByEmail = await UserModel.findOne({ email });

    if (userByEmail) {
      return res
        .status(403)
        .json({ error: "Cette adresse mail est déjà prise" });
    }

    const salt = await bcrypt.genSalt(10);
    encryptedPassword = await bcrypt.hash(password, salt);

    const getcoordinates = await axios.get(
      "https://api-adresse.data.gouv.fr/search/",
      {
        params: {
          q: address,
        },
      }
    );

    const coordinates = getcoordinates.data.features[0].geometry.coordinates;

    const userDoc = UserModel({
      firstname,
      lastname,
      email,
      password: encryptedPassword,
      address: {
        address: address.address,
        coordonates: {
          lat: coordinates[1],
          long: coordinates[0],
        },
      },
    });

    await userDoc.save();

    logDisplayer("INFO", `(POST) ${req.originalUrl} : 200`);

    return res.json({ success: true });
  } catch (error) {
    console.log(error, ` <== error`);
    logDisplayer("ERROR", `(POST) ${req.originalUrl} : 500`);
    return res.status(500).send(error);
  }
};

/**
 * POST - Sign in
 * @param { email: string, password: string }
 *
 * @return { token: string, user: User }
 */

const signIn = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email: email })
      .select("+password")
      .exec();

    if (!user) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const token = jwt.sign({ user: user._id }, process.env.TOKEN_KEY);

    const { password, ...userData } = user;

    delete userData._doc.password;

    logDisplayer("INFO", `(POST) ${req.originalUrl} : 200`);

    return res.json({ token, user: userData._doc });
  } catch (error) {
    logDisplayer("ERROR", `(POST) ${req.originalUrl} : 500`);
    return res.status(500).send(error);
  }
};

/**
 * GET - Current user
 * @return User
 */

const me = async (req, res) => {
  try {
    logDisplayer("INFO", `(GET) ${req.originalUrl} : 200`);

    return res.json(req.user);
  } catch (error) {
    logDisplayer("ERROR", `(GET) ${req.originalUrl} : 500`);
    return res.status(500).send(error);
  }
};

module.exports = {
  signUp,
  signIn,
  me,
};
