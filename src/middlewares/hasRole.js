const { logDisplayer } = require("../utils");

const hasRole = (role) => {
  return (req, res, next) => {
    try {
      if (req.user.role !== role) {
        return res
          .status(401)
          .json({ error: "Vous n'êtes pas autorisé à effectuer cette action" });
      }

      next();
    } catch (error) {
      logDisplayer("ERROR", error);
      return res.status(401).json({ error: "Vous n'êtes pas livreur" });
    }
  };
};

module.exports = hasRole;
