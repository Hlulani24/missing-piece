import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";

const categories = [
  { key: "headwear", label: "Headwear", img: "/sample-products/panel-cap.jpg" },
  { key: "bodywear", label: "Bodywear", img: "/sample-products/hoodie-front-design.jpg" },
  { key: "bottomwear", label: "Bottomwear", img: "/sample-products/short-pants.jpg" },
  { key: "other", label: "Other items", img: "/sample-products/school-bag.jpg" },
];

const steps = [
  { n: "1", title: "Browse the shop", copy: "Scroll the catalog and find what's missing from your wardrobe." },
  { n: "2", title: "Build your order", copy: "Pick a size and colour and add it — no account, no checkout." },
  { n: "3", title: "DM to confirm", copy: "Send it to WhatsApp or email and we'll sort delivery with you directly." },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products", { params: { featured: true } })
      .then((res) => setFeatured(res.data))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-ink text-paper overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] mb-6">
              Built for the dreamers,<br />the hustlers, and the<br />ones who never fit the mold.
            </h1>
            <p className="text-paper/70 max-w-md mb-8">
              Missing Piece is a small streetwear label out of South Africa — every
              drop printed in limited runs, every order sent straight to a real
              person on WhatsApp. Est. 2025.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="bg-crimson hover:bg-crimsonDark transition-colors px-6 py-3 rounded-full font-bold text-sm"
              >
                Shop the drop
              </Link>
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "27677432782"}?text=${encodeURIComponent("Hi Missing Piece! I'd like to order.")}`}
                target="_blank"
                rel="noreferrer"
                className="border border-paper/40 hover:border-paper transition-colors px-6 py-3 rounded-full font-bold text-sm"
              >
                DM to order
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="/sample-products/mafia-jersey.jpg"
              alt="Missing Piece full price list"
              className="w-64 sm:w-80 rounded-sm border-4 border-paper shadow-2xl rotate-2"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display text-2xl mb-8">Shop by category</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c) => (
            <Link
              key={c.key}
              to={`/shop?category=${c.key}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-ink"
            >
              <img
                src={c.img}
                alt={c.label}
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 text-paper font-display text-lg">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works — a real 3-step process, so numbering earns its place */}
      <section className="bg-white border-y border-line/10">
        <div className="max-w-6xl mx-auto px-4 py-16 grid sm:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div key={step.n} className="relative pl-14">
              <span className="absolute left-0 top-0 font-display text-5xl text-crimson/15 leading-none">
                {step.n}
              </span>
              <h3 className="font-display text-lg mb-2">{step.title}</h3>
              <p className="text-smoke text-sm leading-relaxed">{step.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl">Fan favorites</h2>
          <Link to="/shop" className="text-sm font-semibold text-crimson hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-line/10 animate-pulse" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-smoke">New drops coming soon — check back shortly.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Lifestyle strip */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/lifestyle/crewneck-cap.jpg"
            alt="Missing Piece crewneck and cap"
            className="rounded-sm object-cover aspect-[4/3] w-full"
          />
          <img
            src="/lifestyle/navy-tee.jpg"
            alt="Missing Piece tee"
            className="rounded-sm object-cover aspect-[4/3] w-full"
          />
        </div>
      </section>

      {/* DM banner */}
      <section className="bg-crimson text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 text-center">
          <p className="font-display text-xl sm:text-2xl">DM 067 743 2782 FOR ORDERS!</p>
          <p className="text-white/80 text-sm mt-2">
            Add items to your order below, then send it straight to WhatsApp — no
            card details, no checkout, just a chat.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;