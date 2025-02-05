export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      const payload = await request.json();

      // 處理 Cloudflare 通知
      if (payload.notification) {
        const notification = payload.notification;

        // 組織 Telegram 訊息內容
        const messageText = `
🔔 *${notification.title}*
───────────────
${notification.description || notification.message || "無描述"}
───────────────
⏰ ${new Date(notification.timestamp).toLocaleString("zh-TW")}
`;

        // 發送到 Telegram（這裡用您設定的 TELEGRAM_CHAT_ID）
        await sendTelegramMessage(env, env.TELEGRAM_CHAT_ID, messageText);

        return new Response("通知已轉發至 Telegram", { status: 200 });
      }
    }

    return new Response("OK");
  },
};

async function sendTelegramMessage(env, chatId, text) {
  const response = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      }),
    }
  );
  return response.json();
}
