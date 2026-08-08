const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minLenght: 6,
    },
    phoneNumber: {
      type: Number,
      uniqure: true,
    },
    profilePicture: String,
    dob: Date,
    address: String,
    curriculumVitae: String,
    heigh: Number,
    weight: Number,
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
