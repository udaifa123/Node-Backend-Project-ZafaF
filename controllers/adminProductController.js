const Product = require("../models/Product");

/* ================= CREATE PRODUCT ================= */
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, description, stock } = req.body;

    const product = await Product.create({
      name,
      price,
      category,
      description,
      stock,
      image: req.file ? req.file.filename : "",
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET PRODUCTS (SEARCH + FILTER + PAGINATION) ================= */
exports.getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    // 🔹 BASE QUERY
    const query = { isDeleted: false };

    // 🔍 SEARCH (BY PRODUCT NAME)
    if (req.query.search) {
      query.name = {
        $regex: req.query.search,
        $options: "i", // case-insensitive
      };
    }

    // 🏷 CATEGORY FILTER
    if (req.query.category && req.query.category !== "all") {
      query.category = req.query.category;
    }

    // 🔢 TOTAL COUNT
    const total = await Product.countDocuments(query);

    // 📦 FETCH PRODUCTS
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE PRODUCT ================= */
exports.updateProduct = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = req.file.filename;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE PRODUCT (SOFT DELETE) ================= */
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
