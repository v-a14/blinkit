const express = require("express");
const router = express.Router();
const { productModel, validateProduct } = require("../models/product");
const { categoryModel } = require("../models/category");
const upload = require("../config/multer_config");
const { string } = require("joi");
const validateAdmin = require("../middlewares/admin");

router.get("/", async (req, res) => {
  let prods = await productModel.find();
  console.log(prods.length);
  res.send("done successfully");
});

router.post("/", upload.single("image"), async (req, res) => {
  let { name, price, category, stock, description, image } = req.body;
  validateProduct({ name, price, category, stock, description, image });

  const isCategory = await categoryModel.findOne({
    name: category,
  });

  if (!isCategory) {
    let myCategory = await categoryModel.create({ name: category });
    myCategory.save();
  }

  let myProduct = await productModel.create({
    name: name,
    price: price,
    category: category,
    stock: stock,
    description: description,
    image: req.file.buffer,
  });

  await myProduct.save();

  res.redirect(`/admin/products`);
});

router.get("/delete/:id", validateAdmin, async (req, res) => {
  let prods = await productModel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/admin/products");
});

router.post("/delete", validateAdmin, async (req, res) => {
  try {
    let prods = await productModel.findOneAndDelete({
      _id: req.body.product_id,
    });
    return res.redirect("/admin/products");
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
