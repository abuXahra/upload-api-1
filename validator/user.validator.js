const Joi = require("joi");

const userRegSchema = Joi.object(
  {
    fullName: Joi.string().required().min(3).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    phoneNumber: Joi.number().optional(),
    profilePicture: Joi.string().optional(),
    dob: Joi.date().optional(),
    address: Joi.string().optional(),
    curriculumVitae: Joi.string().optional(),
    heigh: Joi.number().optional(),
    weight: Joi.number().optional(),
  },
  {
    timestamps: true,
  },
);

const userLoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required().min(8).max(50),
});

module.exports = { userRegSchema, userLoginSchema };
