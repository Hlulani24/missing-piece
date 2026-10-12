import { usingCloudinary } from "../middleware/upload.js";

// @route POST /api/upload
// Returns a URL the frontend stores on the product. Branch explicitly on the
// usingCloudinary flag rather than checking req.file.path's truthiness — Multer's
// local disk storage also sets .path (to a filesystem path, not a URL), so a
// truthy-check alone would silently pick the wrong branch in local-fallback mode.
export const uploadImage = (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("No image file received");
    }

    const url = usingCloudinary
      ? req.file.path
      : `${process.env.BACKEND_PUBLIC_URL || `${req.protocol}://${req.get("host")}`}/uploads/${req.file.filename}`;

    res.status(201).json({ url });
  } catch (err) {
    next(err);
  }
};
