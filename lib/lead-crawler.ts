import puppeteer from "puppeteer-core";

export type CrawledBusiness = {
  name: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  address?: string;
  phone?: string;
  website?: string;
};

/**
 * Crawls Google Maps search results for businesses matching the query + location.
 * Uses a headless Chromium instance to render the JS-heavy page, scrolls the
 * results feed to load more entries, then extracts visible business data.
 */
export async function crawlGoogleMaps(
  query: string,
  location: string,
): Promise<CrawledBusiness[]> {
  const executablePath =
    process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium";

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1280,1024",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );
    await page.setViewport({ width: 1280, height: 1024 });

    const searchQuery = `${query} ${location}`;
    const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Wait for place links to appear
    await page
      .waitForSelector('a[href*="/maps/place/"]', { timeout: 15000 })
      .catch(() => {});

    // Scroll the results feed to load more entries
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        const feed = document.querySelector('div[role="feed"]');
        if (feed) {
          const el = feed as HTMLElement;
          el.scrollBy(0, el.scrollHeight);
        } else {
          window.scrollBy(0, 800);
        }
      });
      await new Promise((r) => setTimeout(r, 1500));
    }

    // Extract business data from the rendered DOM
    const results = (await page.evaluate(() => {
      const items: Array<{
        name: string;
        category?: string;
        rating?: number;
        reviewCount?: number;
        address?: string;
        website?: string;
      }> = [];
      const seen = new Set<string>();

      const links = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('a[href*="/maps/place/"]'),
      );

      for (const link of links) {
        const name =
          (link.getAttribute("aria-label") || "").trim() ||
          (link.textContent || "").trim();
        if (!name || seen.has(name)) continue;
        seen.add(name);

        // Walk up to a container that holds the full card info
        let container: HTMLElement = link;
        for (let d = 0; d < 8; d++) {
          if (container.parentElement) container = container.parentElement;
        }
        const text = container.textContent || "";

        // Rating: a decimal number like "4.5" appearing before a review count
        const ratingMatch = text.match(/(\d\.\d)\s*[\(]/);
        const rating = ratingMatch ? parseFloat(ratingMatch[1]) : undefined;

        // Review count: (123) or (1,234) possibly followed by a word
        const reviewMatch = text.match(
          /\(([\d,\.]+)\s*(?:reviews?|ulasan||\))/i,
        );
        const reviewCount = reviewMatch
          ? parseInt(reviewMatch[1].replace(/[,.]/g, ""), 10)
          : undefined;

        // Website: first external link that isn't a google URL
        const websiteEl = container.querySelector<HTMLAnchorElement>(
          'a[href^="http"]:not([href*="google."])',
        );
        const website = websiteEl?.href;

        // Category: a short text-only span that isn't a number or the name
        let category: string | undefined;
        const spans = Array.from(container.querySelectorAll("span"));
        for (const span of spans) {
          const t = (span.textContent || "").trim();
          if (
            t.length > 2 &&
            t.length < 60 &&
            !/^\d/.test(t) &&
            !t.includes(name) &&
            !/(open|closed|buka|tutup|hours|jam|directions|rute)/i.test(t) &&
            !span.querySelector("*")
          ) {
            category = t;
            break;
          }
        }

        items.push({ name, category, rating, reviewCount, website });
      }

      return items;
    })) as CrawledBusiness[];

    if (!results.length) {
      throw new Error(
        "No business listings were found on the page. Google may have shown a consent screen or CAPTCHA — try again with a more specific query.",
      );
    }

    return results;
  } finally {
    await browser.close();
  }
}
