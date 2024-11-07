const mongoose = require("mongoose");
const Joi = require("joi");

// Define the Mongoose schema with validations
const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true, // Assuming user is required
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true, // Assuming at least one product is required
    },
  ],
  totalPrice: {
    type: Number,
    required: true, // Assuming total price is required
    min: 0, // Total price cannot be negative
  },
});

// Compile the Mongoose model
const cartModel = mongoose.model("cart", cartSchema);

// Define the Joi validation function
const validateCart = (data) => {
  const schema = Joi.object({
    user: Joi.string().required(), // Assuming user ID is a string (ObjectId in string format)
    products: Joi.array()
      .items(Joi.string().required()) // Array of product IDs as strings
      .min(1) // At least one product must be present
      .required(),
    totalPrice: Joi.number().min(0).required(), // Total price must be a non-negative number
  });

  return schema.validate(data, { abortEarly: false });
};

// Export both the model and the Joi validation function
module.exports = {
  cartModel,
  validateCart,
};
