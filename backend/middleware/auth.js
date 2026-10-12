import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

// Every route in this app that needs protecting is an admin route — there is no
// customer login on this site. "protect" checks the JWT is valid and attaches the
// admin to req.admin; there is no separate adminOnly step because every logged-in
// account here IS an admin by definition.
export const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      res.status(401);
      throw new Error("Not authorized, admin no longer exists");
    }

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401);
    next(new Error("Not authorized, token failed"));
  }
};
