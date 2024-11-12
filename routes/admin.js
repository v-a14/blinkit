const { adminModel } = require("../models/admin");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateAdmin = require("../middlewares/admin");
const { valid } = require("joi");
const { productModel } = require("../models/product");
const { categoryModel } = require("../models/category");

// used to create a single admin 
if (
  typeof process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV == "DEVELOPMENT"
) {
  router.get("/create", async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("admin", salt);
    try {
      let adminUser = new adminModel({
        name: "Vaibhav Agarwal",
        email: "admin@blink.com",
        password: hash,
        role: "admin",
      });

      await adminUser.save();
      let token = jwt.sign({ email: "admin@blink.com" , admin : true}, process.env.JWT_KEY);
      res.cookie("token", token);
      res.send("admin created successfully");
    } catch (err) {
      res.send(err.message);
    }
  });
}


// get call to show the login page 
router.get("/login", (req, res) => {
  res.render("admin_login");
});

// when the admin tries to login 
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await adminModel.findOne({
    email: email,
  });

  console.log(email, password, user.password);

  if (!user) res.send("no admin exists");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.send("password not correct");
  let token = jwt.sign({ email: "admin@blink.com" , admin : true}, process.env.JWT_KEY);
  res.cookie("token", token);
  res.redirect("/admin/dashboard");
});

// shows all the products accoding to the category 
router.get("/products", validateAdmin, async (req, res) => {
  const result = await productModel.aggregate([
    {
      // Group products by their 'category' field
      $group: {
        _id: "$category",
        products: { $push: "$$ROOT" }, // Collect all products for each category
      },
    },
    {
      // Project to limit each group's products to the first 10 items
      $project: {
        category: "$_id",
        products: { $slice: ["$products", 10] },
        _id: 0,
      },
    },
  ]);

  // Convert the result into the desired object format
  const productsByCategory = result.reduce((acc, curr) => {
    acc[curr.category] = curr.products;
    return acc;
  }, {});

  // for(key in productsByCategory){
  //   console.log(key);
  // }
  
  // Pass productsByCategory to the EJS template
  res.render("admin_products", {products : productsByCategory});
});


// used to create the new product 
router.get("/dashboard", validateAdmin, async (req, res) => {
  const prodCount = await productModel.countDocuments();
  const categCount = await categoryModel.countDocuments();
  res.render("admin_dashboard", {prodCount, categCount});
});

// added the logout functionality
router.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.send("logged out successfully");
});

module.exports = router;
