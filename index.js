import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// get your bot token from Render environment variable
const TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

// replace this with your own chat ID (we'll get it next)
const CHAT_ID = "YOUR_CHAT_ID_HERE"; 

// homepage
app.get("/", (req, res) => res.send("Bot is live ✅"));

// webhook route handles BOTH TradingView + Telegram
app.post("/webhook", async (req, res) => {
  const data = req.body;
  console.log("Incoming data:", data);

  try {
    // ⚡ 1. Handle TradingView alert JSON
    if (data.symbol || data.price || data.condition) {
      const text = `📈 TradingView Alert\nSymbol: ${data.symbol}\nAction: ${data.condition || "N/A"}\nPrice: ${data.price || "N/A"}`;
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      });
      console.log("Sent TradingView alert to Telegram ✅");
    }

    // 💬 2. Handle Telegram messages (normal bot replies)
    if (data.message) {
      const chatId = data.message.chat.id;
      const text = data.message.text || "";
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: `You said: ${text}` }),
      });
      console.log("Replied to Telegram message ✅");
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.sendStatus(500);
  }
});

// Start server on Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on ${PORT}`));