import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const navLinks = [
  { to: "/shop", label: "Shop" },
  { to: "/shop?category=headwear", label: "Headwear" },
  { to: "/shop?category=bodywear", label: "Bodywear" },
  { to: "/shop?category=bottomwear", label: "Bottomwear" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const desktopLinkClass = "text-sm font-semibold text-ink hover:text-crimson transition-colors";

const Navbar = () => {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* The blur lives on this inner wrapper, not on <header> itself — backdrop-blur creates a
          "containing block" for any position:fixed element inside it, which was silently
          trapping the mobile menu inside the navbar's own height instead of the full screen. */}
      <div className="bg-paper/95 backdrop-blur border-b border-line/10">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <img
              src="/logo.jpg"
              alt="Missing Piece Clothing Brand"
              className="h-12 w-12 rounded-full object-cover border border-ink/10"
            />
            <span className="font-display text-lg leading-none hidden sm:block">
              MISSING PIECE
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={desktopLinkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 bg-ink text-paper px-4 py-2 rounded-full text-sm font-bold"
            >
              Order
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-crimson text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center items-center gap-1.5 h-10 w-10 shrink-0"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span className={`block h-0.5 w-6 bg-ink transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 bg-ink transition-opacity ${menuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`block h-0.5 w-6 bg-ink transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel — a direct child of <header>, outside the blurred wrapper above,
          so position:fixed here is relative to the real screen, not the navbar bar. */}
      <div
        className={`md:hidden fixed inset-x-0 top-20 bottom-0 bg-ink text-paper transition-transform duration-300 ease-out overflow-y-auto ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col px-6 py-10 gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className="font-display text-3xl leading-none hover:text-crimson transition-colors"
            >
              {l.label}
            </Link>
          ))}

          <div className="pt-6 mt-6 border-t border-paper/10 flex flex-col gap-4">
            <Link
              to="/admin/login"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold text-paper/60 hover:text-paper"
            >
              Staff login
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;