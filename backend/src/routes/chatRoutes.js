const express = require("express");
const { getMessages, sendMessage } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/messages", protect, getMessages);
router.post("/messages", protect, sendMessage);

module.exports = router;
