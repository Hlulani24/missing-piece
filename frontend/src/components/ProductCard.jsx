import { Link } from "react-router-dom";

const ProductCard = ({ product }) => (
  <Link
    to={`/product/${product._id}`}
    className="group block bg-white rounded-2xl overflow-hidden border border-line/10 hover:shadow-lg transition-shadow"
  >
    <div className="aspect-square bg-paper overflow-hidden">
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-smoke text-sm">
          Photo coming soon
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-ink leading-snug">{product.name}</h3>
      <div className="mt-1 flex items-center gap-2">
        <span className="font-display text-crimson">R{product.price}</span>
        {product.originalPrice && (
          <span className="text-sm text-smoke line-through">R{product.originalPrice}</span>
        )}
      </div>
    </div>
  </Link>
);

export default ProductCard;
