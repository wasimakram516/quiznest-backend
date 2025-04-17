const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Sample template download
router.get("/sample/download/:choicesCount", questionController.downloadSampleTemplate);

// Excel upload
router.post("/upload/:gameId", protect, adminOnly, upload.single("file"), questionController.uploadQuestions);

// Manual CRUD
router.get("/:gameId", protect, questionController.getQuestions);
router.post("/:gameId", protect, adminOnly, questionController.addQuestion);
router.put("/:gameId/:questionId", protect, adminOnly, questionController.updateQuestion);
router.delete("/:gameId/:questionId", protect, adminOnly, questionController.deleteQuestion);

module.exports = router;
