import { NextRequest, NextResponse } from "next/server";
import { chromium, Browser, BrowserContext, Page } from "playwright";
import * as cheerio from "cheerio";
import { CheerioAPI } from "cheerio";

interface ResumeLink {
  originalUrl: string;
  hash: string;
  fullName: string;
  convertedUrl: string;
}

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
const RESUMES_PER_PAGE = 50;

function extractLinksFromHtml($: CheerioAPI): string[] {
  const links: string[] = [];

  $("div[data-qa='resume-serp__resume']").each((_, container) => {
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

    if (request.headers.get("requestCookie")) {
      const cookies = request.headers
        .get("requestCookie")!
        .split(";")
        .map((cookie) => {
          const [name, value] = cookie.trim().split("=");
          return { name, value, domain: "hh.kz", path: "/" };
        });
      console.log(request.headers.get("cookie")!);
      await context.addCookies(cookies);
    }

    console.log("Creating first page");

    const firstPage = await context.newPage();
    await firstPage.goto(`${BASE_URL}?vacancyId=${VACANCY_ID}`);
    await firstPage.waitForSelector('h2[data-qa="bloko-header-2"]');

    const firstPageHtml = await firstPage.content();
    const $first = cheerio.load(firstPageHtml);

    console.log("Extracting links from first page");
    // Get total pages
    const headerText = $first('h2[data-qa="bloko-header-2"]').text();
    const totalResumesMatch = headerText.match(/\d+/);
    if (!totalResumesMatch) {
      throw new Error("Could not find total resumes count");
    }

    const totalResumes = parseInt(totalResumesMatch[0], 10);
    const totalPages = Math.ceil(totalResumes / RESUMES_PER_PAGE);

    // Extract links from first page immediately
    const firstPageLinks = extractLinksFromHtml($first);
    console.log(`Found ${firstPageLinks.length} links on page null`);

    const scrapePage = async (pageNum: number): Promise<string[]> => {
      const page = await context.newPage();
      try {
        const url = `${BASE_URL}?vacancyId=${VACANCY_ID}&page=${pageNum}`;
        console.log("Fetching:", url);

        await page.goto(url);
        await page.waitForSelector("div[data-qa='resume-serp__resume']");

        const html = await page.content();
        const $ = cheerio.load(html);

        const links = extractLinksFromHtml($);
        console.log(`Found ${links.length} links on page ${pageNum}`);

        return links;
      } finally {
        await page.close();
      }
    };

    // Scrape remaining pages in parallel
    const remainingPromises = Array.from({ length: totalPages - 1 }, (_, i) =>
      scrapePage(i + 1)
    );

    // Close first page as we're done with it
    await firstPage.close();

    // Wait for all remaining pages
    const remainingResults = await Promise.all(remainingPromises);

    // Combine all results
    const allLinks = [...firstPageLinks, ...remainingResults.flat()];

    return NextResponse.json({
      success: true,
      links: allLinks,
      total: allLinks.length,
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
