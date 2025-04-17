const Business = require("../models/Business");
const Game = require("../models/Game");
const response = require("../utils/response");
const asyncHandler = require("../middlewares/asyncHandler");
const { uploadToCloudinary } = require("../utils/uploadToCloudinary");
const { deleteImage } = require("../config/cloudinary");

// ✅ Utility: Slug sanitizer
const sanitizeSlug = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")         // Replace spaces with hyphens
    .replace(/[^a-z0-9\-]/g, ""); // Remove special characters

// ✅ Create Business
exports.createBusiness = asyncHandler(async (req, res) => {
  const { name, slug, description } = req.body;

  if (!name || !slug) {
    return response(res, 400, "Name and slug are required");
  }

  const sanitizedSlug = sanitizeSlug(slug);

  // Check if slug already exists
  const existing = await Business.findOne({ slug: sanitizedSlug });
  if (existing) {
    return response(res, 409, "Slug already in use. Please choose another.");
  }

  let logoUrl = "";
  if (req.file) {
    const uploaded = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
    logoUrl = uploaded.secure_url;
  }

  const business = await Business.create({
    name,
    slug: sanitizedSlug,
    logoUrl,
    description,
    createdBy: req.user.id,
  });

  return response(res, 201, "Business created successfully", business);
});

// ✅ Get All Businesses
exports.getAllBusinesses = asyncHandler(async (req, res) => {
  const businesses = await Business.find().sort({ createdAt: -1 });
  return response(res, 200, "Fetched all businesses", businesses);
});

// ✅ Get Business by Slug
exports.getBusinessBySlug = asyncHandler(async (req, res) => {
  const business = await Business.findOne({ slug: req.params.slug });
  if (!business) {
    return response(res, 404, "Business not found");
  }
  return response(res, 200, "Business found", business);
});

// ✅ Update Business
exports.updateBusiness = asyncHandler(async (req, res) => {
  const business = await Business.findById(req.params.id);
  if (!business) {
    return response(res, 404, "Business not found");
  }

  const { name, slug, description } = req.body;

  // If slug is being changed, sanitize and check for conflict
  if (slug && slug !== business.slug) {
    const sanitizedSlug = sanitizeSlug(slug);
    const slugExists = await Business.findOne({ slug: sanitizedSlug });
    if (slugExists) {
      return response(res, 409, "Slug already in use by another business");
    }
    business.slug = sanitizedSlug;
  }

  business.name = name || business.name;
  business.description = description || business.description;

  if (req.file) {
    if (business.logoUrl) {
      await deleteImage(business.logoUrl);
    }
    const uploaded = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
    business.logoUrl = uploaded.secure_url;
  }

  await business.save();
  return response(res, 200, "Business updated", business);
});

// ✅ Delete Business (and its related games)
exports.deleteBusiness = asyncHandler(async (req, res) => {
  const business = await Business.findById(req.params.id);
  if (!business) {
    return response(res, 404, "Business not found");
  }

  // Check if games exist under this business
  const gamesCount = await Game.countDocuments({ businessId: business._id });
  if (gamesCount > 0) {
    return response(res, 400, "Cannot delete business with active games");
  }

  // Optional: Delete the logo image
  if (business.logoUrl) {
    await deleteImage(business.logoUrl);
  }

  await business.deleteOne();

  return response(res, 200, "Business deleted successfully");
});
