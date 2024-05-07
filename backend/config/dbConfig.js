const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
  try {
    mongoose
      .connect(process.env.DB_URL)
      .then(() => console.log(`DB CONNECTION SUCCESSFUL`))
      .catch((error) => console.log(`DB CONNECTION ERROR `, error));
  } catch (error) {
    console.log(`DB CONNECTION ERROR`, error);
  }
};

module.exports = dbConnect;
