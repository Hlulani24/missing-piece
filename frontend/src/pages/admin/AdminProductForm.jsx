import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

const emptyForm = {
  name: "",
  category: "headwear",
  price: "",
  originalPrice: "",
  description: "",
  image: "",
  sizes: "",
  colors: "",
  isFeatured: false,
  isAvailable: true,
};

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/products/admin/all`).then((res) => {
      const product = res.data.find((p) => p._id === id);
      if (product) {
        setForm({
          ...product,
          price: String(product.price),
          originalPrice: product.originalPrice ? String(product.originalPrice) : "",
          sizes: (product.sizes || []).join(", "),
          colors: (product.colors || []).join(", "),
        });
      }
    });
  }, [id, isEdit]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await api.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((f) => ({ ...f, image: res.data.url }));
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [],
        colors: form.colors ? form.colors.split(",").map((s) => s.trim()).filter(Boolean) : [],
      };

      if (isEdit) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl mb-6">{isEdit ? "Edit product" : "Add product"}</h1>

      {error && (
        <p className="bg-crimson/10 text-crimson text-sm rounded-lg px-3 py-2 mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl border border-line/10 p-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input
            value={form.name}
            onChange={handleChange("name")}
            placeholder="e.g. Hoodie (Front Design)"
            required
            className="w-full border border-line/30 rounded-lg px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Category</label>
            <select
              value={form.category}
              onChange={handleChange("category")}
              className="w-full border border-line/30 rounded-lg px-3 py-2"
            >
              <option value="headwear">Headwear</option>
              <option value="bodywear">Bodywear</option>
              <option value="bottomwear">Bottomwear</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Price (R)</label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange("price")}
              placeholder="e.g. 350"
              required
              className="w-full border border-line/30 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Was-price (optional — shows a strikethrough for a sale item)
          </label>
          <input
            type="number"
            min="0"
            value={form.originalPrice}
            onChange={handleChange("originalPrice")}
            placeholder="e.g. 400"
            className="w-full border border-line/30 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Description (optional)</label>
          <textarea
            value={form.description}
            onChange={handleChange("description")}
            placeholder="Short description shown on the product page"
            rows={3}
            className="w-full border border-line/30 rounded-lg px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Sizes (comma-separated, optional)</label>
            <input
              value={form.sizes}
              onChange={handleChange("sizes")}
              placeholder="S, M, L, XL"
              className="w-full border border-line/30 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Colors (comma-separated, optional)</label>
            <input
              value={form.colors}
              onChange={handleChange("colors")}
              placeholder="Black, Red, White"
              className="w-full border border-line/30 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Photo</label>
          {form.image && (
            <img src={form.image} alt="" className="w-24 h-24 object-cover rounded-lg mb-2" />
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploading && <p className="text-xs text-smoke mt-1">Uploading…</p>}
        </div>

        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={form.isFeatured} onChange={handleChange("isFeatured")} />
          Feature on homepage
        </label>

        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={form.isAvailable !== false} onChange={(e) => setForm((f) => ({...f, isAvailable: e.target.checked}))} />
          In stock (uncheck to hide from the shop without deleting it)
        </label>

        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full bg-ink text-paper py-3 rounded-full font-bold uppercase disabled:opacity-60"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Add product"}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;
