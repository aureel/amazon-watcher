import { getPricesFromAmazonProductPage } from "./scraper";
import { notifyPrices } from "./notifier";

async function scrapeAmazonAndNotify(params: { amazonProductId: string; priceThreshold?: number }) {
  const { amazonProductId, priceThreshold } = params;
  const { availablePrices, productTitle } = await getPricesFromAmazonProductPage({
    amazonProductId,
  });

  // eslint-disable-next-line no-console
  console.log({ productTitle, availablePrices, priceThreshold });

  await notifyPrices({ amazonProductId, productTitle, prices: availablePrices, priceThreshold });
}

export { scrapeAmazonAndNotify };
