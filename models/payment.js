const mongoose = require("mongoose");
const Joi = require("joi");

// Define the Mongoose schema with validations
const paymentSchema = mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
    required: true, // Assuming order reference is required
  },
  amount: {
    type: Number,
    required: true, // Assuming amount is required
    min: 0, // Amount cannot be negative
  },
  method: {
    type: String,
    required: true, // Assuming method is required
  },
  status: {
    type: String,
    required: true, // Assuming status is required
  },
  transactionId: {
    type: String,
    required: true, // Assuming transactionId is required
  },
});

// Compile the Mongoose model
const paymentModel = mongoose.model("payment", paymentSchema);

// Define the Joi validation function
const validatePayment = (data) => {
  const schema = Joi.object({
    order: Joi.string().required(), // Validating that order is a required string (ObjectId in string format)
    amount: Joi.number().min(0).required(), // Amount must be a non-negative number
    method: Joi.string().required(), // Validating that method is a required string
    status: Joi.string().required(), // Validating that status is one of the predefined values
    transactionId: Joi.string().required(), // Validating that transactionId is a required string
  });

  return schema.validate(data, { abortEarly: false });
};

// Export both the model and the Joi validation function
module.exports = {
  paymentModel,
  validatePayment,
};
