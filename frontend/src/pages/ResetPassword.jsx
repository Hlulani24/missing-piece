import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password });
      setSession(data);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed — the link may have expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-line/10 p-8">
        <h1 className="font-display text-xl mb-6">Set a new password</h1>

        {error && (
          <p className="bg-crimson/10 text-crimson text-sm rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            required
            minLength={6}
            className="w-full border border-line/30 rounded-lg px-3 py-2"
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            required
            minLength={6}
            className="w-full border border-line/30 rounded-lg px-3 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper py-3 rounded-full font-bold uppercase disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save new password"}
          </button>
        </form>

        <Link to="/admin/login" className="block text-center mt-4 text-sm text-crimson hover:underline">
          ← Back to login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
