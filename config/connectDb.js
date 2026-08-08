const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Database successfully");
  } catch (err) {
    console.log("Error connecting to Database", err.message);
  }
}

module.exports = connectDb;
