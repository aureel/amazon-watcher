import _ from "lodash";
import Slimbot from "slimbot";

import { generateAmazonLink } from "../helpers/generate-amazon-link";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const slimbot = new Slimbot(TELEGRAM_TOKEN);

async function _notifyByTelegram(params: {
  amazonProductId: string;
  productTitle: string;
  prices: number[];
}) {
  const { amazonProductId, productTitle, prices } = params;

  const formattedPrices = prices.map((price) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(price)
  );

  const formattedTitle = _.truncate(productTitle, {
    length: 50,
  });

  const productUrl = generateAmazonLink(amazonProductId);

  const message = `${formattedTitle} in Stock:\nPrices: <b>${formattedPrices.join(
    " , "
  )}</b>\n<a href="${productUrl}">Amazon Link</a>`;

  return slimbot.sendMessage(TELEGRAM_CHAT_ID, message, {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
}

async function notifyPrices(params: {
  amazonProductId: string;
  productTitle: string;
  prices: number[];
  priceThreshold?: number;
}) {
  const { amazonProductId, productTitle, prices, priceThreshold } = params;

  if (prices.length === 0 || (priceThreshold != null && !prices.some((p) => p <= priceThreshold))) {
    return;
  }

  await _notifyByTelegram({ amazonProductId, productTitle, prices });
}

export { notifyPrices };
