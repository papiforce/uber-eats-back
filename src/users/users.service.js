const UserModel = require("./users.model");
const { logDisplayer } = require("../utils");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

/**
 * GET - Users list
 * @queryParam { 
    id?: number
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
    const {
      id,
      onlyActive,
      search,
      withoutFounder,
      limit = 10,
      page,
    } = req.query;

    const users = await UserModel.find({
      ...(id && { _id: id }),
      ...(onlyActive && { isDelete: false }),
      ...(withoutFounder && { roles: { $nin: ["FOUNDER"] } }),
      ...(search && {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }),
    })
      .limit(limit)
      .skip(limit * page);

    logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

    res.json(users);
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(500).send(error);
  }
};

/**
 * PUT - User
 * @queryParam { 
    username?: string
    email?: string
    description?: string
  }
 *
 * @return Users
 */

const updateUserProfile = async (req, res) => {
  try {
    const { username, email, description } = req.body;

    const userId = req.params.userId;

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new httpError(403, "Cet utilisateur n'existe pas");
    }

    const checkEmail = await UserModel.findOne({ email: user.email });
    const checkUsername = await UserModel.findOne({ username: user.username });

    if (checkEmail || checkUsername) {
      if (
        checkEmail.email !== user.email &&
        checkUsername.username !== user.username
      ) {
        throw new httpError(403, "Email et pseudo déjà utilisés");
      }

      if (checkEmail.email !== user.email && checkEmail) {
        throw new httpError(403, "Cette email est déjà utilisée");
      }

      if (checkUsername.username !== user.username && checkUsername) {
        throw new httpError(403, "Ce pseudo est déjà utilisée");
      }
    }

    const updatedUser = Object.assign(user, { username, description });

    if (email && email !== user.email) {
      const token = await TokensModel.findOne({
        userId: userId,
        type: "EMAIL",
      });

      if (token) {
        await token.deleteOne();
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(resetToken, 10);

      const tokenDock = TokensModel({
        userId,
        type: "EMAIL",
        value: email,
        token: hash,
        expirationDate: Date.now(),
      });

      await tokenDock.save();

      const templateOptions = {
        newEmail: email,
        oldEmail: user.email,
        username: user.username,
        link: `${process.env.WEBSITE_URL}/parametres?token=${hash}&id=${userId}`,
      };

      const mailOptions = {
        from: '"Scanverse" <assistance@scanverse.fr>',
        to: email,
        subject: "Changement d'adresse mail",
        html: changeEmailTemplate(templateOptions),
        attachments: [
          {
            filename: "logo.png",
            path: __dirname + "/../templates/assets/logo.png",
            cid: "logo-scanverse",
          },
        ],
      };

      mailer.sendMail(mailOptions).catch((err) => {
        console.log(err);
        throw new httpError(404, "Le mail ne s'est pas envoyé");
      });
    }

    await updatedUser.save();

    logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

    res.json(updatedUser);
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(500).send(error);
  }
};

module.exports = {
  get,
  updateUserProfile,
};
