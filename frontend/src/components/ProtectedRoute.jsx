import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// There's only one kind of account on this site (admin), so unlike CHUKS/AMARA this
// doesn't need a "role" prop — just "are you logged in at all."
const ProtectedRoute = ({ children }) => {
  const { admin } = useAuth();
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
};

export default ProtectedRoute;
