const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "27677432782";
const STORE_EMAIL = import.meta.env.VITE_STORE_EMAIL || "missingpiece@gmail.com";

const Contact = () => (
  <div className="max-w-2xl mx-auto px-4 py-16 text-center">
    <h1 className="font-display text-3xl mb-4">DM to order</h1>
    <p className="text-smoke mb-10">
      No checkout, no card details — just message us your order, size and where to
      send it, and we'll sort out the rest with you directly.
    </p>

    <div className="grid sm:grid-cols-2 gap-4">
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Missing Piece! I'd like to order.")}`}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col items-center gap-2 bg-[#25D366] text-white py-8 rounded-2xl font-bold"
      >
        <span className="text-lg">WhatsApp</span>
        <span className="text-sm font-normal">+27 67 743 2782</span>
      </a>
      <a
        href={`mailto:${STORE_EMAIL}`}
        className="flex flex-col items-center gap-2 border border-ink text-ink py-8 rounded-2xl font-bold"
      >
        <span className="text-lg">Email</span>
        <span className="text-sm font-normal">{STORE_EMAIL}</span>
      </a>
    </div>
  </div>
);

export default Contact;
