import jwt from "jsonwebtoken";
import crypto from "crypto";
import Admin from "../models/Admin.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// @route POST /api/auth/login
// There's no public registration — the one admin account is created once by
// `npm run seed`. If you ever need a second admin account, add them directly via
// the seed script or MongoDB Atlas; there's no self-signup on purpose.
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+password");
    if (!admin || !(await admin.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      token: signToken(admin._id),
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({
    _id: req.admin._id,
    name: req.admin.name,
    email: req.admin.email,
    phone: req.admin.phone,
  });
};

// @route PUT /api/auth/profile
// Lets the logged-in admin change their own name/email/phone, and optionally their
// password (requires the current password) — so nobody needs to go into MongoDB
// Atlas by hand to fix a typo'd email or rotate a password.
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id).select("+password");

    if (name) admin.name = name;
    if (phone !== undefined) admin.phone = phone;

    if (email && email.toLowerCase() !== admin.email) {
      const exists = await Admin.findOne({ email: email.toLowerCase() });
      if (exists) {
        res.status(400);
        throw new Error("That email is already in use");
      }
      admin.email = email.toLowerCase();
    }

    if (newPassword) {
      if (!currentPassword) {
        res.status(400);
        throw new Error("Enter your current password to set a new one");
      }
      const matches = await admin.matchPassword(currentPassword);
      if (!matches) {
        res.status(401);
        throw new Error("Current password is incorrect");
      }
      if (newPassword.length < 6) {
        res.status(400);
        throw new Error("New password must be at least 6 characters");
      }
      admin.password = newPassword;
    }

    await admin.save();

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      token: signToken(admin._id),
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/forgot-password
// Deliberately gives the same response whether or not the email matches an account,
// so nobody can use this to figure out which emails have an account here.
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email: (email || "").toLowerCase() });

    if (admin) {
      const rawToken = admin.createPasswordResetToken();
      await admin.save({ validateBeforeSave: false });
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
      // No email service is wired up on this project yet — log it so you can test the
      // flow locally, and wire up Nodemailer (same pattern as CHUKS/AMARA) before launch.
      console.log(`[password reset] ${admin.email} -> ${resetUrl}`);
    }

    res.json({
      message: "If that email has an account, a reset link has been generated.",
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+password +resetPasswordToken +resetPasswordExpires");

    if (!admin) {
      res.status(400);
      throw new Error("Reset link is invalid or has expired");
    }

    if (!req.body.password || req.body.password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }

    admin.password = req.body.password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: signToken(admin._id),
    });
  } catch (err) {
    next(err);
  }
};
