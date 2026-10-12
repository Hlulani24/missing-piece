import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        if (res.data.sizes?.length) setSize(res.data.sizes[0]);
        if (res.data.colors?.length) setColor(res.data.colors[0]);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-smoke mb-4">We couldn't find that item — it may have sold out.</p>
        <Link to="/shop" className="text-crimson font-semibold hover:underline">
          ← Back to shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return <div className="max-w-6xl mx-auto px-4 py-20 text-smoke">Loading…</div>;
  }

  const handleAdd = () => {
    addItem(product, size, color, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
      <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-line/10">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-smoke">
            Photo coming soon
          </div>
        )}
      </div>

      <div>
        <h1 className="font-display text-3xl mb-3">{product.name}</h1>
        <div className="flex items-center gap-3 mb-6">
          <span className="font-display text-2xl text-crimson">R{product.price}</span>
          {product.originalPrice && (
            <span className="text-smoke line-through">R{product.originalPrice}</span>
          )}
        </div>

        {product.description && (
          <p className="text-smoke mb-6 leading-relaxed">{product.description}</p>
        )}

        {product.sizes?.length > 0 && (
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-2">Size</label>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded-full border text-sm font-semibold ${
                    size === s ? "bg-ink text-paper border-ink" : "border-line/30"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.colors?.length > 0 && (
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`px-4 py-2 rounded-full border text-sm font-semibold ${
                    color === c ? "bg-ink text-paper border-ink" : "border-line/30"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <label className="block text-sm font-semibold mb-2">Quantity</label>
          <div className="inline-flex items-center border border-line/30 rounded-full">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-10 h-10 font-bold"
            >
              −
            </button>
            <span className="w-10 text-center">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="w-10 h-10 font-bold">
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="w-full bg-ink text-paper py-4 rounded-full font-bold uppercase hover:bg-crimson transition-colors"
        >
          {added ? "Added to order ✓" : "Add to order"}
        </button>
        <Link
          to="/cart"
          className="block text-center mt-4 text-sm font-semibold text-crimson hover:underline"
        >
          View order →
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;
