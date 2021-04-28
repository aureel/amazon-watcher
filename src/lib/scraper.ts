import _ from "lodash";
import cheerio from "cheerio";
import puppeteer from "puppeteer";
import UserAgent from "user-agents";

const generateUserAgent = new UserAgent({
  deviceCategory: "desktop",
});

let browserWSEndpoint: string | null =
  process.env.BROWSERLESS_API_TOKEN != null
    ? `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_API_TOKEN}`
    : null;

async function _getBrowser(): Promise<puppeteer.Browser> {
  if (browserWSEndpoint != null) {
    // reconnect to previously used Chromium
    return puppeteer.connect({ browserWSEndpoint });
  }

  // start a brand new browser
  const browser = await puppeteer.launch();

  // store WS endpoint in oder to be able to reconnect to Chromium
  browserWSEndpoint = browser.wsEndpoint();

  return browser;
}

function _convertStrToFloat(str): number {
  return parseFloat(str.replace(/,/g, ""));
}

// function _getProxyUrl(proxyUrls: string): string {
//   // return one of the proxy urls randomly
//   return _.sample(proxyUrls.split(","));
// }

function _getProductTitleAndPricesFromHtml(html: string) {
  const $ = cheerio.load(html);

  const productTitle = $("#productTitle").text().trim();

  if (_.isEmpty(productTitle)) {
    throw new Error("The product information could not be found");
  }

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

  const browser = await _getBrowser();

  try {
    const page = await browser.newPage();
    page.setUserAgent(generateUserAgent().toString());
    page.setViewport({ width: 2560, height: 1540 });

    await page.goto(pageUrl);

    const { availablePrices, productTitle } = _getProductTitleAndPricesFromHtml(
      await page.content()
    );

    return { availablePrices, productTitle };
  } finally {
    await browser.disconnect();
  }
}

export { getPricesFromAmazonProductPage };
