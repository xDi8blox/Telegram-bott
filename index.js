import express from "express";
import fetch from "node-fetch";
import serverless from "serverless-http";

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const CHAT_ID = "1685859860"; // your chat ID

app.get("/", (req, res) => res.send("Bot is live and logging ✅"));

// webhook endpoint
app.post("/webhook", async (req, res) => {
  try {
    let data = req.body;
    console.log("🔹 Raw incoming data:", data);

    // In case TradingView sends invalid JSON or empty body
    if (!data || Object.keys(data).length === 0) {
      console.log("⚠️ No JSON body detected, using raw text fallback");
      data = { raw: req.body || "Empty payload" };
    }

    // Build message
    let alertText = "";
    if (data.symbol && data.condition) {
      alertText = `⚡ TradingView Alert\nSymbol: ${data.symbol}\nAction: ${data.condition}\nPrice: ${data.price}`;
    } else {
      alertText = `📡 Raw Alert:\n${JSON.stringify(data, null, 2)}`;
    }

    // Send message to Telegram
    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: alertText }),
    });

    const result = await response.json();
    console.log("✅ Telegram API response:", result);

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error in webhook:", err);
    res.sendStatus(500);
  }
});

app.listen(10000, () => console.log("🚀 Bot server running on port 10000"));
export const handler = serverless(app);