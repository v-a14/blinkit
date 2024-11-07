const mongoose = require("mongoose");
const Joi = require("joi");

// Define the Mongoose schema with validations
const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["admin", "superadmin"],  // Assuming role can only be "admin" or "superadmin"
    default: "admin",
  },
});

// Compile the Mongoose model
const adminModel = mongoose.model("admin", adminSchema);

// Define the Joi validation function
const validateAdmin = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid("admin", "superadmin").default("admin"),  // Matching role options
  });

  return schema.validate(data, { abortEarly: false });
};

// Export both the model and the Joi validation function
module.exports = {
  adminModel,
  validateAdmin,
};
