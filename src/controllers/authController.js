const User = require("../models/User");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const response = require("../utils/response");
const asyncHandler = require("../middlewares/asyncHandler");

// ✅ Generate Access & Refresh Tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    env.jwt.secret,
    { expiresIn: env.jwt.accessExpiry }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    env.jwt.secret,
    { expiresIn: env.jwt.refreshExpiry }
  );

  return { accessToken, refreshToken };
};

// ✅ Register Admin
exports.registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return response(res, 400, "All fields are required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return response(res, 400, "User already exists");
  }

  const user = new User({
    name,
    email: email.toLowerCase(),
    password,
    role: "admin",
  });

  await user.save();

  return response(res, 201, "Admin registered successfully", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ✅ Login & Set Refresh Token in Cookie
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return response(res, 400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    return response(res, 401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = generateTokens(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return response(res, 200, "Login successful", {
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ✅ Refresh Access Token
exports.refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return response(res, 401, "No refresh token provided");
  }

  jwt.verify(refreshToken, env.jwt.secret, async (err, decoded) => {
    if (err) return response(res, 403, "Invalid refresh token");

    const user = await User.findById(decoded.id);
    if (!user) return response(res, 404, "User not found");

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      env.jwt.secret,
      { expiresIn: env.jwt.accessExpiry }
    );

    return response(res, 200, "Token refreshed", { accessToken: newAccessToken });
  });
});

// ✅ Logout User (Clear Refresh Token Cookie)
exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });

  return response(res, 200, "Logged out successfully");
});
