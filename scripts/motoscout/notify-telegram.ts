import axios from 'axios';

interface TelegramAlert {
  title: string;
  price?: number;
  currency?: string;
  url: string;
  source: string;
  searchName: string;
  imageUrl?: string;
}

export async function sendTelegramAlert(alert: TelegramAlert): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Telegram credentials not configured, skipping alert');
    return;
  }

  try {
    const priceText = alert.price
      ? `💰 ${alert.currency} ${alert.price.toLocaleString()}`
      : '💰 Price not listed';

    const message = `
🏍️ *New MotoScout Listing*

📋 *${alert.title}*

${priceText}
📍 Source: ${alert.source}
🔍 Search: ${alert.searchName}

🔗 [View Listing](${alert.url})
    `.trim();

    await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: false,
      },
      {
        timeout: 10000,
      }
    );

    console.log('Telegram alert sent successfully');
  } catch (error: any) {
    console.error('Failed to send Telegram alert:', error.message);
    // Don't throw - we don't want to fail the scan if Telegram is down
  }
}
