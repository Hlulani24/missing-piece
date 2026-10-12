import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Same pattern used on the CHUKS and AMARA backends: use Cloudinary when its three
// env vars are set, otherwise fall back to local disk storage so local dev still
// works without a Cloudinary account. DON'T rely on local disk in production —
// Render's filesystem is wiped on every redeploy/restart, so photos uploaded through
// the admin dashboard would vanish. Set the three CLOUDINARY_* env vars before a
// client starts uploading real product photos.
const hasCloudinaryConfig =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

let storage;

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "missing-piece-products",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 1200, height: 1200, crop: "limit" }],
    },
  });
} else {
  console.warn(
    "[upload] Cloudinary env vars not set — falling back to local disk storage. " +
      "This is fine for local dev but will NOT survive a Render redeploy. " +
      "Set CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET before going live."
  );

  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ok) return cb(null, true);
    cb(new Error("Only image files (jpg, jpeg, png, webp) are allowed"));
  },
});

export default upload;
export const usingCloudinary = hasCloudinaryConfig;
