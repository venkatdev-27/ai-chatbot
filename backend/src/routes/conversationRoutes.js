const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { 
    createConversation, 
    getConversations, 
    updateConversation, 
    deleteConversation, 
    getConversationMessages 
} = require("../controllers/conversationController");

const router = express.Router();

router.use(protect); // Protect all routes

router.route("/").get(getConversations).post(createConversation);
router.route("/:id").put(updateConversation).delete(deleteConversation);
router.route("/:id/messages").get(getConversationMessages);

module.exports = router;
