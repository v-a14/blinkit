const { adminModel } = require("../models/admin");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateAdmin = require("../middlewares/admin");
const { valid } = require("joi");
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
      let token = jwt.sign({ email: "admin@blink.com" }, process.env.JWT_KEY);
      res.cookie("token", token);
      res.send("admin created successfully");
    } catch (err) {
      res.send(err.message);
    }
  });
}

router.get("/login", (req, res) => {
  res.render("admin_login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await adminModel.findOne({
    email: email,
  });

  console.log(email, password, user.password);

  if (!user) res.send("no admin exists");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.send("password not correct");
  let token = jwt.sign({ email: "admin@blink.com" }, process.env.JWT_KEY);
  res.cookie("token", token);
  res.redirect("/admin/dashboard");
});

router.get("/dashboard", validateAdmin, (req, res) => {
  res.render("admin_dashboard");
});

// added the logout functionality
router.get("/logout", (req, res) => {
    res.cookie("token", "")
    res.send("logged out successfully")
})

module.exports = router;
