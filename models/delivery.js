const mongoose = require("mongoose");
const Joi = require("joi");

// Define the Mongoose schema with validations
const deliverySchema = mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
    required: true, // Assuming order reference is required
  },
  deliveryBoy: {
    type: String,
    required: true, // Assuming deliveryBoy is required
  },
  status: {
    type: String,
    enum: ["pending", "in progress", "delivered", "cancelled"], // Define possible statuses
    required: true, // Assuming status is required
  },
  trackingUrl: {
    type: String,
    required: true, // Assuming trackingUrl is required
  },
  estimatedDeliveryTime: {
    type: Number,
    required: true, // Assuming estimatedDeliveryTime is required
    min: 0, // Assuming time cannot be negative
  },
});

// Compile the Mongoose model
const deliveryModel = mongoose.model("delivery", deliverySchema);

// Define the Joi validation function
const validateDelivery = (data) => {
  const schema = Joi.object({
    order: Joi.string().required(), // Validating that order is a string (ObjectId in string format)
    deliveryBoy: Joi.string().required(), // Validating that deliveryBoy is a required string
    status: Joi.string()
      .valid("pending", "in progress", "delivered", "cancelled")
      .required(), // Validating that status is one of the predefined values
    trackingUrl: Joi.string().uri().required(), // Validating that trackingUrl is a valid URI
    estimatedDeliveryTime: Joi.number().min(0).required(), // Validating that estimatedDeliveryTime is a non-negative number
  });

  return schema.validate(data, { abortEarly: false });
};

// Export both the model and the Joi validation function
module.exports = {
  deliveryModel,
  validateDelivery,
};
