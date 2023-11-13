const { logger } = require("../config");

const logDisplayer = (type, message) => {
  return process.env.NODE_ENV === "production"
    ? console[type === "INFO" ? "log" : "error"](message)
    : logger[type === "INFO" ? "info" : "error"](message);
};

module.exports = logDisplayer;
