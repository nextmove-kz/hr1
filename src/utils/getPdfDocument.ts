"use client";

let pdfJS: typeof import("pdfjs-dist");

export const initPdfJS = async () => {
  if (!pdfJS) {
    pdfJS = await import("pdfjs-dist");
    pdfJS.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }
  return pdfJS;
};

export const getPDFDocument = async (file: File | ArrayBuffer) => {
  const pdf = await initPdfJS();

  try {
    let data;
    if (file instanceof File) {
      // For File objects, read as ArrayBuffer
      data = await file.arrayBuffer();
    } else {
      // For ArrayBuffer, use directly
      data = file;
    }

    const document = await pdf.getDocument({ data }).promise;
    return document;
  } catch (error) {
    console.error("Error loading PDF:", error);
    throw error;
  }
};
