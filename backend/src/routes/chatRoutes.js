const express = require("express");
const {
  getMessages,
  sendMessage,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   GET /api/conversations/:conversationId/messages
 * @desc    Get all messages for a conversation
 * @access  Private
 */
router.get(
  "/conversations/:conversationId/messages",
  protect,
  getMessages
);

/**
 * @route   POST /api/conversations/:conversationId/messages
 * @desc    Send a message to a conversation
 * @access  Private
 */
router.post(
  "/conversations/:conversationId/messages",
  protect,
  sendMessage
);

module.exports = router;
