import _ from "lodash";
import Slimbot from "slimbot";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const slimbot = new Slimbot(TELEGRAM_TOKEN);

async function _notifyByTelegram(params: { productTitle: string; prices: number[] }) {
  const { productTitle, prices } = params;

  const formattedPrices = prices.map((price) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(price)
  );

  const formattedTitle = _.truncate(productTitle, {
    length: 60,
  });

  return slimbot.sendMessage(
    TELEGRAM_CHAT_ID,
    `New Prices found for your Amazon Product ${formattedTitle}: '${formattedPrices.join(" , ")}'`
  );
}

async function notifyPrices(params: {
  productTitle: string;
  prices: number[];
  priceThreshold?: number;
}) {
  const { productTitle, prices, priceThreshold } = params;

  if (prices.length === 0 || (priceThreshold != null && !prices.some((p) => p <= priceThreshold))) {
    return;
  }

  await _notifyByTelegram({ productTitle, prices });
}

export { notifyPrices };
