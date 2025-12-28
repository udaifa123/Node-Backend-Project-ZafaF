// const Product = require("../models/Product");
// const Joi = require("joi");

// const createProduct = async (req, res) => {
//   const schema = Joi.object({
//     name: Joi.string().required(),
//     description: Joi.string().allow(""),
//     price: Joi.number().required(),
//   });

//   const { error } = schema.validate(req.body);
//   if (error) {
//     res.status(400);
//     throw new Error(error.details[0].message);
//   }

//   const product = await Product.create(req.body);
//   res.status(201).json({ message: "Product Created Successfully", product });
// };

// const getProducts = async (req, res) => {
//   const products = await Product.find();
//   res.json(products);
// };

// // 👉 Add this function
// const getProductById = async (req, res) => {
//   const product = await Product.findById(req.params.id);

//   if (!product) {
//     return res.status(404).json({ message: "Product not found" });
//   }

//   res.json(product);
// };

// module.exports = { createProduct, getProducts, getProductById };



// const Product = require("../models/Product");

// // CREATE PRODUCT
// const createProduct = async (req, res) => {
//   try {
//     const { name, price, description, category } = req.body;

//     if (!name || !price || !description)
//       return res.status(400).json({ message: "Missing fields" });

//     // Get image filename from Multer
//     const image = req.file ? req.file.filename : null;

//     const product = new Product({ name, price, description, category, image });
//     const createdProduct = await product.save();

//     res.status(201).json(createdProduct);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // GET ALL PRODUCTS
// const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find({ isDeleted: false });
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // GET SINGLE PRODUCT
// const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findOne({ _id: req.params.id, isDeleted: false });
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // SOFT DELETE PRODUCT
// const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json({ message: "Product soft deleted", product });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   createProduct,
//   getProducts,
//   getProductById,
//   deleteProduct,
// };





const Product = require("../models/Product");

// CREATE PRODUCT (Admin)
exports.createProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const image = req.file ? req.file.filename : null;

  const product = new Product({ name, description, price, category, image });
  const savedProduct = await product.save();
  res.status(201).json(savedProduct);
};

// GET ALL PRODUCTS (User/Public)
exports.getProducts = async (req, res) => {
  const filter = { isDeleted: false };
  if (req.query.category) filter.category = req.query.category;

  const products = await Product.find(filter);
  res.json(products);
};

// GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, isDeleted: false });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

// UPDATE PRODUCT (Admin)
exports.updateProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product || product.isDeleted) return res.status(404).json({ message: "Product not found" });

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.category = category || product.category;
  if (req.file) product.image = req.file.filename;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
};

// SOFT DELETE PRODUCT (Admin)
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product || product.isDeleted) return res.status(404).json({ message: "Product not found" });

  product.isDeleted = true;
  await product.save();
  res.json({ message: "Product soft deleted" });
};
