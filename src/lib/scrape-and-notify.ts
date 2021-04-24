import { getPricesFromAmazonProductPage } from "./scraper";
import { notifyPrices } from "./notifier";

async function scrapeAmazonAndNotify(params: { amazonProductId: string; priceThreshold?: number }) {
  const { amazonProductId, priceThreshold } = params;
  const { availablePrices, productTitle } = await getPricesFromAmazonProductPage({
    amazonProductId,
  });

  await notifyPrices({ productTitle, prices: availablePrices, priceThreshold });
}

export { scrapeAmazonAndNotify };
