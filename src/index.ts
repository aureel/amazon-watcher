import cron from "node-cron";
import * as Sentry from "@sentry/node";

import "./init-config";
import "./init-sentry";

import { scrapeAmazonAndNotify } from "./lib/scrape-and-notify";
import { cronConfig } from "./cron-config";

cronConfig.forEach((config) => {
  const { cronRule, amazonProductId, priceThreshold } = config;

  cron.schedule(
    cronRule,
    async () => {
      try {
        if (amazonProductId == null) {
          throw new Error("Missing `amazonProductId`");
        }

        await scrapeAmazonAndNotify({ amazonProductId, priceThreshold });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        Sentry.captureException(err);
      }
    },
    {
      timezone: "America/Montreal",
    }
  );
});
