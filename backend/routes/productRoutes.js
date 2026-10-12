import express from "express";
import {
  getProducts,
  getProductById,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// IMPORTANT: this admin-only route must be declared BEFORE "/:id", otherwise Express
// would try to treat the literal word "admin" as a product id.
router.get("/admin/all", protect, getAllProductsAdmin);

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
