
const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const client = new OpenAI({
    apiKey: process.env.FREEAPI_KEY,
    baseURL: "http://127.0.0.1:31415/v1"
});

router.post("/", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                error: "Please enter a message."
            });
        }

        const completion = await client.chat.completions.create({
            model: "auto",
            messages: [
                {
                    role: "user",
                    content: message.trim()
                }
            ]
        });

        const reply = completion.choices[0].message.content;

        res.json({ reply });

    } catch (error) {
        console.error("AI API Error:", error.message);

        res.status(500).json({
            error: "Failed to generate AI response. Please try again."
        });
    }
});

module.exports = router;
