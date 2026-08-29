import express from "express";
import Thread from "../models/Thread.js";
import getGenAIAPIResponse from "../utils/genAI.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply authMiddleware to ALL routes in this router
router.use(authMiddleware);

// GET /api/thread — return only threads belonging to the logged-in user
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({ owner: req.user.userId })
            .sort({ updatedAt: -1 }) // most recent first
            .select('threadId title updatedAt createdAt'); // send minimal fields for sidebar
        res.json(threads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});

// GET /api/thread/:threadId — return messages of a specific thread (owner-scoped)
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({ threadId, owner: req.user.userId });

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.json(thread.messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch thread" });
    }
});

// DELETE /api/thread/:threadId — delete a specific thread (owner-scoped)
router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId, owner: req.user.userId });
        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.status(200).json({ success: "Thread deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

// POST /api/chat — send a message; creates or appends to a thread (owner-scoped)
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        let thread = await Thread.findOne({ threadId, owner: req.user.userId });

        if (!thread) {
            // Create a new thread scoped to the logged-in user
            thread = new Thread({
                threadId,
                title: message.slice(0, 60), // use first 60 chars of message as title
                owner: req.user.userId,
                messages: [{ role: 'user', content: message }]
            });
        } else {
            // Append message to existing thread
            thread.messages.push({ role: 'user', content: message });
        }

        const assistantReply = await getGenAIAPIResponse(message);

        thread.messages.push({ role: 'assistant', content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();
        res.json({ reply: assistantReply });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default router;