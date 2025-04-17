const express = require("express");
const router = express.Router();
const businessController = require("../controllers/businessController");
const { protect, superadminOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.post("/", protect, superadminOnly, upload.single("logo"), businessController.createBusiness);
router.get("/", protect, businessController.getAllBusinesses);
router.get("/:slug", businessController.getBusinessBySlug);
router.put("/:id", protect, superadminOnly, upload.single("logo"), businessController.updateBusiness);
router.delete("/:id", protect, superadminOnly, businessController.deleteBusiness);

module.exports = router;
