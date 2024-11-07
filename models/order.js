const mongoose = require("mongoose");
const Joi = require("joi");

// Define the Mongoose schema with validations
const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true, // Assuming user reference is required
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
  address: {
    type: String,
    required: true, // Assuming address is required
  },
  status: {
    type: String,
    enum: ["pending", "processed", "shipped", "delivered", "cancelled"], // Define possible statuses
    required: true, // Assuming status is required
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "payment",
    required: true, // Assuming payment reference is required
  },
  delivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "delivery",
    required: true, // Assuming delivery reference is required
  },
});

// Compile the Mongoose model
const orderModel = mongoose.model("order", orderSchema);

// Define the Joi validation function
const validateOrder = (data) => {
  const schema = Joi.object({
    user: Joi.string().required(), // Validating that user is a required string (ObjectId in string format)
    products: Joi.array()
      .items(Joi.string().required()) // Array of product IDs as strings, at least one product is required
      .min(1)
      .required(),
    totalPrice: Joi.number().min(0).required(), // Total price must be a non-negative number
    address: Joi.string().required(), // Validating that address is a required string
    status: Joi.string()
      .valid("pending", "processed", "shipped", "delivered", "cancelled")
      .required(), // Validating that status is one of the predefined values
    payment: Joi.string().required(), // Validating that payment is a required string (ObjectId in string format)
    delivery: Joi.string().required(), // Validating that delivery is a required string (ObjectId in string format)
  });

  return schema.validate(data, { abortEarly: false });
};

// Export both the model and the Joi validation function
module.exports = {
  orderModel,
  validateOrder,
};
