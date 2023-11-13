const jwt = require("jsonwebtoken");
const { logDisplayer } = require("../utils");

const isAdmin = (req, res, next) => {
  try {
    if (!req.user.roles.includes("ADMIN")) {
      return res.status(401).json({ error: "Vous n'êtes pas administrateur" });
    }

    next();
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(401).json({ error: "Vous n'êtes pas administrateur" });
  }
};

module.exports = isAdmin;
