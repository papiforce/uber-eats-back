const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);

async function databaseConnection() {
  try {
    const connectionString = process.env.MONGO_URI;

    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("Connexion à la base de données : succès");
  } catch (err) {
    console.error(err);
  }
}

module.exports = databaseConnection;
