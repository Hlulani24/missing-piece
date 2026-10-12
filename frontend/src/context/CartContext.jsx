import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "mp_cart";

// There's no payment gateway on this site on purpose — Missing Piece takes orders by
// DM/WhatsApp, not checkout. The "cart" here is just a running order list the
// customer builds up, which gets turned into a pre-filled WhatsApp message (and a
// mailto: fallback) at the end. Nothing is ever charged or submitted to a server.
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, size = "", color = "", qty = 1) => {
    setItems((prev) => {
      const key = `${product._id}-${size}-${color}`;
      const existing = prev.find(
        (i) => `${i.productId}-${i.size}-${i.color}` === key
      );
      if (existing) {
        return prev.map((i) =>
          `${i.productId}-${i.size}-${i.color}` === key
            ? { ...i, qty: i.qty + qty }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          color,
          qty,
        },
      ];
    });
  };

  const removeItem = (productId, size, color) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.size === size && i.color === color)
      )
    );
  };

  const updateQty = (productId, size, color, qty) => {
    if (qty < 1) return removeItem(productId, size, color);
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size && i.color === color
          ? { ...i, qty }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  const buildOrderMessage = () => {
    const lines = items.map((i) => {
      const variant = [i.size, i.color].filter(Boolean).join(" / ");
      return `• ${i.name}${variant ? ` (${variant})` : ""} x${i.qty} — R${i.price * i.qty}`;
    });
    return [
      "Hi Missing Piece! I'd like to order:",
      "",
      ...lines,
      "",
      `Total: R${total}`,
      "",
      "My name:",
      "My delivery/collection details:",
    ].join("\n");
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, total, count, buildOrderMessage }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
