import Product from "../models/Product.js";

// @route GET /api/products
// Public catalog. Supports ?category=headwear and only ever returns items marked
// available — an admin marking something "sold out" hides it here immediately.
export const getProducts = async (req, res, next) => {
  try {
    const filter = { isAvailable: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === "true") filter.isFeatured = true;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isAvailable) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/products/admin/all
// Admin-only — returns every product, including sold-out/hidden ones, so the admin
// dashboard never loses track of an item just because it's currently unavailable.
export const getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const { name, category, price, originalPrice, description, image, sizes, colors, isFeatured } =
      req.body;

    if (!name || !category || price === undefined) {
      res.status(400);
      throw new Error("Name, category and price are required");
    }

    const product = await Product.create({
      name,
      category,
      price,
      originalPrice: originalPrice || null,
      description: description || "",
      image: image || "",
      sizes: Array.isArray(sizes) ? sizes : [],
      colors: Array.isArray(colors) ? colors : [],
      isFeatured: !!isFeatured,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const fields = [
      "name",
      "category",
      "price",
      "originalPrice",
      "description",
      "image",
      "sizes",
      "colors",
      "isFeatured",
      "isAvailable",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};
