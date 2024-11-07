  const mongoose = require("mongoose");
const Joi = require("joi");

const addressSchema = mongoose.Schema({
  state: {
    type: String,
    required: true,
    trim: true,
  },
  zip: {
    type: Number,
    required: true,
    min: [10000, "Zip code should be at least 5 digits"],
    max: [99999, "Zip code should be no more than 5 digits"]
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  }
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, "Name should be at least 3 characters"],
      maxlength: [50, "Name should be at most 50 characters"],
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    password: {
      type: String,
      minlength: [8, "Password should be at least 8 characters"]
    },
    phone: {
      type: Number,
      minlength: 10,
      maxlength: 10
    },
    addresses: {
      type: [addressSchema],
    }
  },
  { timestamps: true }
);


const validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phone: Joi.number().integer().min(1000000000).max(9999999999).required(), // Assuming 10-digit phone number
    addresses: Joi.array().items(
      Joi.object({
        state: Joi.string().required(),
        zip: Joi.number().integer().min(10000).max(99999).required(), // Assuming 5-digit zip code
        city: Joi.string().required(),
        address: Joi.string().required()
      })
    ).required()
  });

  // returns true or false 
  return schema.validate(data, { abortEarly: false });
};


const userModel = mongoose.model("user", userSchema);
module.exports = {userModel,validateUser}
