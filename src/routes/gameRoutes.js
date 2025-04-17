const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Upload up to 3 images: cover, name, background
const gameImageUpload = upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "name", maxCount: 1 },
  { name: "background", maxCount: 1 },
]);

router.post("/", protect, adminOnly, gameImageUpload, gameController.createGame);
router.get("/business/:slug", gameController.getGamesByBusinessSlug);
router.get("/", protect, gameController.getAllGames);
router.get("/:id", protect, gameController.getGameById);
router.get("/slug/:slug", gameController.getGameBySlug);
router.put("/:id", protect, adminOnly, gameImageUpload, gameController.updateGame);
router.delete("/:id", protect, adminOnly, gameController.deleteGame);

module.exports = router;
