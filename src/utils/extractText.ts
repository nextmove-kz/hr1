"use client";

import type { PDFDocumentProxy } from "pdfjs-dist";

export const extractTextFromPDF = async (
  document: PDFDocumentProxy
): Promise<string> => {
  const numPages = document.numPages;
  let fullText = "";

  try {
    for (let i = 1; i <= numPages; i++) {
      const page = await document.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n\n";
    }
    return fullText;
  } catch (error) {
    console.error("Error extracting text:", error);
    throw error;
  }
};
