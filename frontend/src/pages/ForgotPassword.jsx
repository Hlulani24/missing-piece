import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-line/10 p-8">
        <h1 className="font-display text-xl mb-2">Reset password</h1>
        {sent ? (
          <p className="text-sm text-smoke">
            If that email has an admin account, a reset link has been generated.
            Check the backend logs (or your inbox, once email sending is wired up) for
            the link.
          </p>
        ) : (
          <>
            <p className="text-sm text-smoke mb-6">
              Enter the admin email and we'll generate a reset link.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="missingpiece@gmail.com"
                required
                className="w-full border border-line/30 rounded-lg px-3 py-2"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-paper py-3 rounded-full font-bold uppercase disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
          </>
        )}
        <Link to="/admin/login" className="block text-center mt-4 text-sm text-crimson hover:underline">
          ← Back to login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
