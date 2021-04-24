import puppeteer from "puppeteer";
import cheerio from "cheerio";

const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36";

function _convertStrToFloat(str) {
  return parseFloat(str.replace(/,/g, ""));
}

function _getAvailablePricesFromHtml(html: string) {
  const $ = cheerio.load(html);

  const productTitle = $("#productTitle").text().trim();

  const prices = $("div#aod-offer-list div#aod-offer-price span.a-price-whole");

  const availablePrices: number[] = [];
  prices.each((index, element) => {
    availablePrices.push(_convertStrToFloat($(element).text()));
  });

  return { productTitle, availablePrices };
}

async function getPricesFromAmazonProductPage(params: { amazonProductId: string }) {
  const { amazonProductId } = params;

  const pageUrl = `https://www.amazon.ca/dp/${amazonProductId}/ref=olp_aod_early_redir?_encoding=UTF8&aod=1`;

  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  page.setUserAgent(USER_AGENT);
  page.setViewport({ width: 2560, height: 1540 });

  await page.goto(pageUrl);

  const { availablePrices, productTitle } = _getAvailablePricesFromHtml(await page.content());

  await browser.close();

  return { availablePrices, productTitle };
}

export { getPricesFromAmazonProductPage };
