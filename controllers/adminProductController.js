const Product = require("../models/Product");

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  const { name, price, category, stock, description } = req.body;

  const product = await Product.create({
    name,
    price,
    category,
    stock,
    description,
    image: req.file?.filename || "",
  });

  res.json(product);
};

// GET PRODUCTS (FILTER)
exports.getProducts = async (req, res) => {
  const { search, category } = req.query;
  let filter = { isDeleted: false };
  if (search) filter.name = { $regex: search, $options: "i" };
  if (category) filter.category = category;

  const products = await Product.find(filter);
  res.json(products);
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  const data = req.body;
  if (req.file) data.image = req.file.filename;

  const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
  res.json(product);
};

// DELETE PRODUCT (SOFT DELETE)
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isDeleted: true });
  res.json({ message: "Product soft-deleted" });
};
