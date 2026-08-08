const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate.middleware");
const {
  userRegSchema,
  userLoginSchema,
} = require("../validator/user.validator");
const userController = require("../controllers/auth.controller");

router.post("/register", validate(userRegSchema), userController.registerUser);

module.exports = router;
