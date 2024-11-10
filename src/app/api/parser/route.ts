import { NextRequest, NextResponse } from "next/server";
import { chromium, Browser } from "playwright";
import * as cheerio from "cheerio";
import { CheerioAPI } from "cheerio";

interface ApiResponse {
  success: boolean;
  links: string[];
  total: number;
  error?: string;
}

interface ScrapeError extends Error {
  statusCode?: number;
}

const BASE_URL = "https://hh.kz/employer/vacancyresponses" as const;
const VACANCY_ID = "110466030" as const;

function extractLinksFromHtml($: CheerioAPI): string[] {
  const links: string[] = [];

  $("div[data-qa='resume-serp__resume']").each((index, container) => {
    // Limit to first 10 results
    if (index >= 10) return false;

    const $link = $(container).find('a[data-qa="serp-item__title"]');
    const $fullName = $(container).find(
      'span[data-qa="resume-serp__resume-fullname"]'
    );

    const href = $link.attr("href");
    const fullName = $fullName.text().trim();

    if (!href || !fullName) return;

    const hashMatch = href.match(/\/resume\/([^?]+)/);
    if (!hashMatch) return;

    const hash = hashMatch[1];
    const encodedName = encodeURIComponent(fullName);
    const convertedUrl = `https://hh.kz/resume_converter/${encodedName}.pdf?hash=${hash}&type=pdf`;

    links.push(convertedUrl);
  });

  return links;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  let browser: Browser | null = null;

  try {
    console.log("Launching browser");
    browser = await chromium.launch();
    const context = await browser.newContext();

    const requestCookie = process.env.HH_COOKIE;
    if (!requestCookie) {
      throw new Error("HH_COOKIE is not set in ENV");
    }

    const cookies = requestCookie.split(";").map((cookie) => {
      const [name, value] = cookie.trim().split("=");
      return { name, value, domain: "hh.kz", path: "/" };
    });
    await context.addCookies(cookies);

    console.log("Creating page");
    const page = await context.newPage();
    await page.goto(`${BASE_URL}?vacancyId=${VACANCY_ID}`);
    await page.waitForSelector('div[data-qa="resume-serp__resume"]');

    const pageHtml = await page.content();
    const $ = cheerio.load(pageHtml);

    console.log("Extracting links from page");
    const links = extractLinksFromHtml($);
    console.log(`Found ${links.length} links`);

    return NextResponse.json({
      success: true,
      links: links,
      total: links.length,
    });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      {
        success: false,
        links: [],
        total: 0,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      {
        status: (error as ScrapeError).statusCode || 500,
      }
    );
  } finally {
    if (browser) await browser.close();
  }
}
