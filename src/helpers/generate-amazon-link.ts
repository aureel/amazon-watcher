function generateAmazonLink(amazonProductId: string): string {
  return `https://www.amazon.ca/dp/${amazonProductId}/ref=olp_aod_early_redir?_encoding=UTF8&aod=1`;
}

export { generateAmazonLink };
