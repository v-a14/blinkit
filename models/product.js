const mongoose = require("mongoose");
const Joi = require("joi");

// Define the Mongoose schema with validations
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true, // Assuming name is required
    minlength: 3, // Minimum length for name
    maxlength: 100, // Maximum length for name
  },
  price: {
    type: Number,
    required: true, // Assuming price is required
    min: 0, // Price cannot be negative
  },
  category: {
    type: String,
    required: true, // Assuming category is required
  },
  stock: {
    type: Number,
    required: true, // Assuming stock is required
  },
  description: {
    type: String,
    required: true, // Assuming description is required
    minlength: 10, // Minimum length for description
    maxlength: 500, // Maximum length for description
  },
  image: {
    type: Buffer,
    required: true, // Assuming image URL is required
  },
});

// Compile the Mongoose model
const productModel = mongoose.model("product", productSchema);

// Define the Joi validation function
const validateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(), // Validating name with min and max length
    price: Joi.number().min(0).required(), // Price must be a non-negative number
    category: Joi.string().required(), // Validating that category is a required string
    stock: Joi.number().required(), // Validating that stock is a required boolean
    description: Joi.string().min(10).max(500).required(), // Validating description with min and max length
    image: Joi.string().optional(), // Validating that image is a required string (URL format)
  });

  return schema.validate(data, { abortEarly: false });
};

// Export both the model and the Joi validation function
module.exports = {
  productModel,
  validateProduct,
};
