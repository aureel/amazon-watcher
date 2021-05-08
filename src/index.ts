import cron from "node-cron";
import * as Sentry from "@sentry/node";

import "./init-config";
import "./init-sentry";

import { scrapeAmazonAndNotify } from "./lib/scrape-and-notify";
import { cronConfig } from "./cron-config";

const ERROR_NAMES_TO_IGNORE_IN_SENTRY = ["TimeoutError"];

function _logInSentry(err: Error): boolean {
  return (
    process.env.NODE_ENV === "production" && !ERROR_NAMES_TO_IGNORE_IN_SENTRY.includes(err.name)
  );
}

cronConfig.forEach((config) => {
  const { cronRule, amazonProductId, priceThreshold } = config;

  cron.schedule(
    cronRule,
    async () => {
      try {
        // eslint-disable-next-line no-console
        console.log("Running Cron", config);

        if (amazonProductId == null) {
          throw new Error("Missing `amazonProductId`");
        }

        await scrapeAmazonAndNotify({ amazonProductId, priceThreshold });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);

        if (_logInSentry(err)) {
          Sentry.captureException(err);
        }
      }
    },
    {
      timezone: "America/Montreal",
    }
  );
});
