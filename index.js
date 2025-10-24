import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

app.get("/", (req, res) => res.send("Bot is live! ✅"));

app.post("/webhook", async (req, res) => {
  const data = req.body;

  if (data.message) {
    const chatId = data.message.chat.id;
    const text = data.message.text || "";

    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `You said: ${text}`,
      }),
    });
  }

  res.sendStatus(200);
});

app.listen(10000, () => console.log("Server running"));