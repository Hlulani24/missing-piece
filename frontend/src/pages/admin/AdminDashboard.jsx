import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products/admin/all")
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  const available = products.filter((p) => p.isAvailable).length;
  const soldOut = products.length - available;

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Dashboard</h1>

      {loading ? (
        <p className="text-smoke">Loading…</p>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-line/10 p-5">
            <p className="text-sm text-smoke">Total products</p>
            <p className="font-display text-3xl">{products.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-line/10 p-5">
            <p className="text-sm text-smoke">Available</p>
            <p className="font-display text-3xl text-crimson">{available}</p>
          </div>
          <div className="bg-white rounded-2xl border border-line/10 p-5">
            <p className="text-sm text-smoke">Sold out / hidden</p>
            <p className="font-display text-3xl">{soldOut}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Link
          to="/admin/products"
          className="bg-ink text-paper px-5 py-3 rounded-full text-sm font-bold uppercase"
        >
          Manage products
        </Link>
        <Link
          to="/admin/products/new"
          className="border border-ink text-ink px-5 py-3 rounded-full text-sm font-bold uppercase"
        >
          Add new product
        </Link>
      </div>

      <p className="text-sm text-smoke mt-8 max-w-lg">
        Orders come in by WhatsApp/DM — there's no order list here to manage, since
        nothing is submitted through the site itself. This dashboard is just for
        keeping the catalog (photos, prices, stock) up to date.
      </p>
    </div>
  );
};

export default AdminDashboard;
