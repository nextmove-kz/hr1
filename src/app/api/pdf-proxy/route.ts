// app/api/pdf-proxy/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    // Get the custom cookie header
    const requestCookie = process.env.HH_COOKIE;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Parse the cookie string into proper cookie format
    const cookies = requestCookie
      ?.split(";")
      .map((cookie) => cookie.trim())
      .join("; ");

    const response = await fetch(url, {
      headers: {
        Cookie: cookies || "",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/pdf,*/*",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://hh.kz/",
        Origin: "https://hh.kz",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
      },
      credentials: "include",
      redirect: "follow",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch PDF: ${response.statusText}. ${errorText}`
      );
    }

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": pdfBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Error proxying PDF:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch PDF",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
