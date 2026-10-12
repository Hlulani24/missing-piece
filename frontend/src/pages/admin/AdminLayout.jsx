import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const linkClass = ({ isActive }) =>
  `block px-4 py-2 rounded-lg text-sm font-semibold ${
    isActive ? "bg-ink text-paper" : "text-ink hover:bg-line/10"
  }`;

const AdminLayout = ({ children }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-paper flex">
      <aside className="w-56 bg-white border-r border-line/10 p-4 hidden sm:flex flex-col">
        <div className="flex items-center gap-2 mb-8 px-2">
          <img src="/logo.jpg" alt="Missing Piece" className="h-8 w-8 object-contain" />
          <span className="font-display text-sm">Admin</span>
        </div>
        <nav className="space-y-1 flex-1">
          <NavLink to="/admin" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/admin/products" className={linkClass}>Products</NavLink>
          <NavLink to="/admin/settings" className={linkClass}>Account settings</NavLink>
        </nav>
        <div className="px-2 pt-4 border-t border-line/10">
          <p className="text-xs text-smoke mb-2">{admin?.name}</p>
          <button onClick={handleLogout} className="text-sm font-semibold text-crimson">
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="sm:hidden flex items-center justify-between bg-white border-b border-line/10 px-4 py-3">
          <span className="font-display text-sm">Missing Piece Admin</span>
          <button onClick={handleLogout} className="text-sm font-semibold text-crimson">
            Log out
          </button>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
