const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createConversation,
  getConversations,
  updateConversation,
  deleteConversation,
  getConversationMessages,
} = require("../controllers/conversationController");

const router = express.Router();

/**
 * 🔐 Protect ALL conversation routes
 */
router.use(protect);

/**
 * 📌 /api/conversations
 */
router
  .route("/")
  .get(getConversations)      // Get all user conversations
  .post(createConversation);  // Create new conversation

/**
 * 📌 /api/conversations/:id
 */
router
  .route("/:id")
  .put(updateConversation)    // Rename/update conversation
  .delete(deleteConversation); // Delete conversation

/**
 * 📌 /api/conversations/:id/messages
 */
router.get("/:id/messages", getConversationMessages);

module.exports = router;
