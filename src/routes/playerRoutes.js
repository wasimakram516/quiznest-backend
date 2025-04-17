const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");

// ✅ Most specific routes first
router.get("/leaderboard/:gameId", playerController.getLeaderboard);
router.get("/export/:gameId", playerController.exportResults);

// ✅ Post to join game
router.post("/:gameId", playerController.joinGame);

// ✅ Patch to submit score
router.patch("/:id", playerController.submitResult);

// ✅ Least specific route last
router.get("/:gameId", playerController.getPlayersByGame);


module.exports = router;
