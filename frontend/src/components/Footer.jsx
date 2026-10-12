import { Link } from "react-router-dom";
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "27677432782";
const STORE_EMAIL = import.meta.env.VITE_STORE_EMAIL || "missingpiece@gmail.com";

const Footer = () => (
  <footer className="bg-ink text-paper mt-20">
    <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 sm:grid-cols-3">
      <div>
          <img src="/logo.jpg" alt="Missing Piece Clothing Brand" className="h-12 w-12 rounded-full object-cover border border-ink/10" />
        <p className="text-sm text-paper/70">
          Built for the dreamers, the hustlers, and the ones who never fit the mold.
          This is not just fashion — it's the missing piece of your story.
        </p>
      </div>
      <div>
        <h4 className="font-display text-sm mb-3">Get in touch</h4>
        <ul className="space-y-2 text-sm text-paper/80">
          <li>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Missing Piece! I have a question.")}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-crimson"
            >
              WhatsApp: +27 67 743 2782
            </a>
          </li>
          <li>
            <a href={`mailto:${STORE_EMAIL}`} className="hover:text-crimson">
              {STORE_EMAIL}
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-display text-sm mb-3">Shop</h4>
        <ul className="space-y-2 text-sm text-paper/80">
          <li><a href="/shop?category=headwear" className="hover:text-crimson">Headwear</a></li>
          <li><a href="/shop?category=bodywear" className="hover:text-crimson">Bodywear</a></li>
          <li><a href="/shop?category=bottomwear" className="hover:text-crimson">Bottomwear</a></li>
          <li><a href="/shop?category=other" className="hover:text-crimson">Other items</a></li>
        </ul>
      </div>
    </div>
        <div className="border-t border-paper/10 py-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-center text-xs text-paper/50">
      <span>© {new Date().getFullYear()} Missing Piece Clothing Brand | Designed By Maluleke Hlulani.</span>
      <Link to="/admin/login" className="hover:text-paper/80">Staff login</Link>
    </div>
  </footer>
);

export default Footer;
