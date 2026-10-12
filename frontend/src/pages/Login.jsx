import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-line/10 p-8">
        <div className="flex justify-center mb-6">
          <img src="/logo.jpg" alt="Missing Piece" className="h-16 w-16 object-contain" />
        </div>
        <h1 className="font-display text-xl text-center mb-1">Admin login</h1>
        <p className="text-sm text-smoke text-center mb-6">
          This is for the Missing Piece team only — customers order by DM, not login.
        </p>

        {error && (
          <p className="bg-crimson/10 text-crimson text-sm rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="missingpiece@gmail.com"
              required
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="email"
              className="w-full border border-line/30 rounded-lg px-3 py-2"
            />
          </div>
          <div>
  <label className="block text-sm font-semibold mb-1">Password</label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Your password"
      required
      className="w-full border border-line/30 rounded-lg px-3 py-2 pr-16"
    />
    <button
      type="button"
      onClick={() => setShowPassword((v) => !v)}
      className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-bold uppercase text-crimson"
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  </div>
</div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper py-3 rounded-full font-bold uppercase disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <Link to="/forgot-password" className="text-crimson hover:underline">
            Forgot password?
          </Link>
          <Link to="/" className="text-smoke hover:underline">
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
