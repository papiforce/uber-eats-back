require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { logDisplayer } = require("./src/utils");
const { databaseConnection } = require("./src/config");
const routes = require("./src/routes");

const app = express();

const whiteList = ["URL PROD HERE"];

const corsOptions = {
  origin: function (origin, callback) {
    var options;
    if (!whiteList.indexOf(origin) !== -1) {
      options = { origin: true };
    } else {
      options = { origin: false };
    }
    callback(null, options);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

databaseConnection();

app.use(express.json({ limit: "50mb" }));

app.use(cors(corsOptions));

app.use("/api", routes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  logDisplayer("INFO", `Serveur disponible sur le port ${PORT}`)
);
