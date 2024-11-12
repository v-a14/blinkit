const express = require("express");
const router = express.Router();
const { categoryModel } = require("../models/category");
const validateAdmin = require("../middlewares/admin");

router.post("/create", validateAdmin, async (req, res) => {
  const catgoryName = req.body.name;
  console.log(catgoryName);
  const checkCategoryAlreadyExists = await categoryModel.findOne({
    name: catgoryName,
  });
  if (!checkCategoryAlreadyExists) {
    const myCategory = await categoryModel.create({
      name: catgoryName,
    });
    res.send(myCategory);
  } else res.send("category already exists");
});

module.exports = router;
