const jwt = require("jsonwebtoken");
const env = require("../config/env");
const response = require("../utils/response");

// ✅ Protect Route (Ensure the user is authenticated)
exports.protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return response(res, 401, "Unauthorized - No token provided");
    }

    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = decoded;

    next();
  } catch (error) {
    return response(res, 401, "Unauthorized - Invalid token", null, error.message);
  }
};

// ✅ Admin OR Superadmin
exports.adminOnly = (req, res, next) => {
  if (!req.user || !["admin", "superadmin"].includes(req.user.role)) {
    return response(res, 403, "Forbidden - Admins only");
  }
  next();
};

// ✅ Superadmin Only
exports.superadminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return response(res, 403, "Forbidden - Superadmin only");
  }
  next();
};
