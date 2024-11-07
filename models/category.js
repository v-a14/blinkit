const mongoose = require("mongoose");
const Joi = require("joi");

// Define the Mongoose schema with validations
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true, // Assuming name is required
    minlength: 3,   // Minimum length for name
    maxlength: 50,  // Maximum length for name
  },
});

// Compile the Mongoose model
const categoryModel = mongoose.model("category", categorySchema);

// Define the Joi validation function
const validateCategory = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(), // Validating name with min and max length
  });

  return schema.validate(data, { abortEarly: false });
};

// Export both the model and the Joi validation function
module.exports = {
    categoryModel,
  validateCategory,
};
