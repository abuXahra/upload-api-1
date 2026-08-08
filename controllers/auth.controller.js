const User = require("../models/user.model");
const AsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = AsyncHandler(async (req, res) => {
  //   collect data
  const {
    fullName,
    email,
    password,
    phoneNumber,
    profilePicture,
    dob,
    address,
    curriculumVitae,
    heigh,
    weight,
  } = req.body;

  // check if user already exist
  const existingUser = await User.find({ email: email });

  if (existingUser) {
    const error = new Error("User already exist");
    error.statusCode = 400;
    throw error;
  }

  // haspassword
  const genSalt = bcrypt.gentSalt(10);
  const hashPassword = bcrypt.hash(password, genSalt);

  // rgister user
  const user = await User.create({
    fullName,
    email,
    password: hashPassword,
    phoneNumber,
    profilePicture,
    dob,
    address,
    curriculumVitae,
    heigh,
    weight,
  });

  // check user
  if (!user) {
    const error = new Error("Error occured while registring user");
    error.statusCode = 500;
    throw error;
  }

  // create token

  //   ACCESS TOKEN
  const accessToken = await jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expireIn: "30m" },
  );

  //   REFRESH TOKEN
  const refreshToken = await jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expireIn: "30d" },
  );

  // send response
  res.status(201).json({
    success: true,
    message: "User registered sucessfully",
    data: { accessToken: accessToken, refreshToken: refreshToken, user: user },
  });
});

exports.login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    const error = new Error("Email does not exist");
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Password or Email is incorrect");
    error.statusCode = 400;
    throw error;
  }

  const accessToken = await jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "30m" },
  );

  const refreshToken = await jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" },
  );

  res.status(200).json({
    message: "User login successful",
    succes: true,
    data: { accessToken: accessToken, refreshToken: refreshToken, user: user },
  });
});

exports.logout = AsyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
