import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "27677432782";
const STORE_EMAIL = import.meta.env.VITE_STORE_EMAIL || "missingpiece@gmail.com";

const Cart = () => {
  const { items, removeItem, updateQty, total, buildOrderMessage, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl mb-3">Your order is empty</h1>
        <p className="text-smoke mb-6">Add a few pieces from the shop to start building your order.</p>
        <Link to="/shop" className="bg-ink text-paper px-6 py-3 rounded-full font-bold uppercase text-sm">
          Browse the shop
        </Link>
      </div>
    );
  }

  const message = buildOrderMessage();
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const mailLink = `mailto:${STORE_EMAIL}?subject=${encodeURIComponent("Missing Piece order")}&body=${encodeURIComponent(message)}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl mb-8">Your order</h1>

      <div className="space-y-4 mb-8">
        {items.map((i) => (
          <div
            key={`${i.productId}-${i.size}-${i.color}`}
            className="flex gap-4 bg-white border border-line/10 rounded-2xl p-4"
          >
            <div className="w-20 h-20 rounded-xl bg-paper overflow-hidden shrink-0">
              {i.image ? (
                <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{i.name}</h3>
              {(i.size || i.color) && (
                <p className="text-sm text-smoke">{[i.size, i.color].filter(Boolean).join(" / ")}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="inline-flex items-center border border-line/30 rounded-full">
                  <button
                    onClick={() => updateQty(i.productId, i.size, i.color, i.qty - 1)}
                    className="w-8 h-8 font-bold text-sm"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{i.qty}</span>
                  <button
                    onClick={() => updateQty(i.productId, i.size, i.color, i.qty + 1)}
                    className="w-8 h-8 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
                <span className="font-display text-crimson">R{i.price * i.qty}</span>
              </div>
            </div>
            <button
              onClick={() => removeItem(i.productId, i.size, i.color)}
              className="text-smoke hover:text-crimson text-sm self-start"
              aria-label={`Remove ${i.name}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-line/10 pt-6 mb-8 flex items-center justify-between">
        <span className="font-display text-xl">Total</span>
        <span className="font-display text-xl text-crimson">R{total}</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-full font-bold uppercase text-sm"
        >
          Order via WhatsApp
        </a>
        <a
          href={mailLink}
          className="flex items-center justify-center gap-2 border border-ink text-ink py-4 rounded-full font-bold uppercase text-sm"
        >
          Order via email
        </a>
      </div>
      <p className="text-xs text-smoke text-center mb-6">
        This sends your order list to us directly — there's no online payment. We'll
        confirm pricing, sizing and delivery/collection with you from there.
      </p>

      <button onClick={clearCart} className="block mx-auto text-sm text-smoke hover:text-crimson">
        Clear order
      </button>
    </div>
  );
};

export default Cart;
