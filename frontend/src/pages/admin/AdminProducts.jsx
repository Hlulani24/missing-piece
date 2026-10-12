import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";

const categoryLabels = {
  headwear: "Headwear",
  bodywear: "Bodywear",
  bottomwear: "Bottomwear",
  other: "Other",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/products/admin/all")
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleAvailable = async (product) => {
    await api.put(`/products/${product._id}`, { isAvailable: !product.isAvailable });
    load();
  };

  const remove = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    await api.delete(`/products/${product._id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-ink text-paper px-5 py-2.5 rounded-full text-sm font-bold uppercase"
        >
          + Add product
        </Link>
      </div>

      {loading ? (
        <p className="text-smoke">Loading…</p>
      ) : (
        <div className="bg-white rounded-2xl border border-line/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper text-left text-smoke">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-line/10">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-paper overflow-hidden shrink-0">
                      {p.image && <img src={p.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-smoke">{categoryLabels[p.category]}</td>
                  <td className="px-4 py-3 font-semibold">R{p.price}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleAvailable(p)}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.isAvailable ? "bg-green-100 text-green-700" : "bg-line/10 text-smoke"
                      }`}
                    >
                      {p.isAvailable ? "In stock" : "Out of stock"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                    <Link to={`/admin/products/${p._id}/edit`} className="text-crimson font-semibold">
                      Edit
                    </Link>
                    <button onClick={() => remove(p)} className="text-smoke hover:text-crimson">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-smoke">
                    No products yet — add your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
