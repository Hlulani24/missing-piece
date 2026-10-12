// Run with: npm run seed
// Safe to run more than once — it checks before creating the admin account or any
// products, so it never duplicates data on a second run.
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";
import Product from "../models/Product.js";

dotenv.config();

// Image paths below point at frontend/public/sample-products/*, which are real
// photos of the real Missing Piece merchandise. They're served by the FRONTEND as
// static files (that's why these are relative paths, not full URLs) — purely so the
// catalog looks fully populated the moment you deploy, for demos and portfolio use.
// Swap each one out for the admin's own uploaded photo whenever you're ready;
// nothing else in the code needs to change when you do.
const sampleProducts = [
  // Head wear
  { name: "Panel Cap", category: "headwear", price: 150, image: "/sample-products/panel-cap.jpg", isFeatured: true },
  { name: "Floppy Beanie", category: "headwear", price: 150, image: "/sample-products/floppy-beanie.jpg" },
  { name: "Balaclava", category: "headwear", price: 150, image: "" },
  { name: "Striped Hat", category: "headwear", price: 150, image: "/sample-products/striped-hat.jpg" },
  { name: "Aesthetic Cap", category: "headwear", price: 170, image: "/sample-products/aesthetic-cap.jpg" },
  { name: "Half Cap", category: "headwear", price: 170, image: "" },

  // Body wear
  { name: "Crop Top", category: "bodywear", price: 200, image: "" },
  { name: "T-Shirt (Front Design)", category: "bodywear", price: 250, image: "/sample-products/tshirt-front-design.jpg", isFeatured: true },
  { name: "T-Shirt (Front & Back Design)", category: "bodywear", price: 280, image: "/sample-products/tshirt-front-back-design.jpg" },
  { name: "Cargo Vest", category: "bodywear", price: 300, image: "" },
  { name: "Hoodie (Front Design)", category: "bodywear", price: 350, image: "/sample-products/hoodie-front-design.jpg", isFeatured: true },
  { name: "Hoodie (Front & Back Design)", category: "bodywear", price: 380, image: "/sample-products/hoodie-front-back-design.jpg" },
  { name: "Mafia Jersey", category: "bodywear", price: 450, image: "/sample-products/mafia-jersey.jpg", isFeatured: true },

  // Bottom wear
  { name: "Short Pants", category: "bottomwear", price: 250, image: "/sample-products/short-pants.jpg" },
  { name: "Sweater Pants", category: "bottomwear", price: 300, image: "/sample-products/sweater-pants.jpg" },
  { name: "Mafia Trouser", category: "bottomwear", price: 400, image: "" },

  // Other items
  { name: "Gloves", category: "other", price: 150, image: "/sample-products/gloves.jpg" },
  { name: "School Bag", category: "other", price: 300, image: "/sample-products/school-bag.jpg" },
];

const run = async () => {
  await connectDB();

  const adminEmail = (process.env.ADMIN_EMAIL || "missingpiece@gmail.com").toLowerCase();
  const existingAdmin = await Admin.findOne({ email: adminEmail });

  if (!existingAdmin) {
    await Admin.create({
      name: process.env.ADMIN_NAME || "Missing Piece Admin",
      email: adminEmail,
      phone: process.env.STORE_WHATSAPP_NUMBER || "",
      password: process.env.ADMIN_PASSWORD || "admin@123",
    });
    console.log(`Admin account created: ${adminEmail}`);
  } else {
    console.log(`Admin account already exists: ${adminEmail}`);
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(sampleProducts);
    console.log(`Seeded ${sampleProducts.length} products.`);
  } else {
    console.log(`Products already exist (${productCount}) — skipping product seed.`);
  }

  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
