import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";

const categoryLabels = {
  headwear: "Headwear",
  bodywear: "Bodywear",
  bottomwear: "Bottomwear",
  other: "Other items",
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = activeCategory ? { category: activeCategory } : {};
    api
      .get("/products", { params })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const setCategory = (key) => {
    if (!key) return setSearchParams({});
    setSearchParams({ category: key });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl mb-2">Shop</h1>
      <p className="text-smoke mb-8">Browse the full catalog. DM us to order — no checkout needed.</p>

      <div className="flex gap-3 overflow-x-auto pb-2 mb-8">
        <button
          onClick={() => setCategory("")}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border ${
            !activeCategory ? "bg-ink text-paper border-ink" : "border-line/30 text-ink"
          }`}
        >
          All
        </button>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border ${
              activeCategory === key ? "bg-ink text-paper border-ink" : "border-line/30 text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-line/10 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-smoke py-20 text-center">
          No items in this category yet — check back soon, or DM us to ask what's coming.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
