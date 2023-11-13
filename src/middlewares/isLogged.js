const jwt = require("jsonwebtoken");
const { logDisplayer } = require("../utils");
const UserModel = require("../users/users.model");

const isLogged = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
      return res.status(401).json({ error: "Vous n'êtes pas connecté" });

    jwt.verify(token, process.env.TOKEN_KEY, async (err, response) => {
      if (err)
        return res.status(401).json({ error: "Vous n'êtes pas connecté" });

      if (response && !response.user)
        return res.status(401).json({ error: "Vous n'êtes pas connecté" });

      const user = await UserModel.findById(response.user);
      req.user = user;
      next();
    });
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(401).json({ error: "Vous n'êtes pas connecté" });
  }
};

module.exports = isLogged;
