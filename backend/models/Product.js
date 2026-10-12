import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["headwear", "bodywear", "bottomwear", "other"],
    },
    price: { type: Number, required: true, min: 0 },
    // Optional "was" price — set this to show a strikethrough original price (a sale item)
    originalPrice: { type: Number, min: 0, default: null },
    description: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
    // Sizes this item comes in, e.g. ["S", "M", "L", "XL"]. Leave empty for one-size items
    // like caps, beanies, bags.
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
