const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Prem AI backend is running ✅");
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "No message received." });
    }

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are Prem AI. Give short, useful answers."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      console.log("Groq Error:", data);
      return res.status(500).json({
        reply: "Groq API error. Check API key or free limit."
      });
    }

    res.json({
      reply: data.choices?.[0]?.message?.content || "No reply received from AI."
    });

  } catch (error) {
    console.log("Server Error:", error);
    res.status(500).json({
      reply: "Server error. Please try again."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});