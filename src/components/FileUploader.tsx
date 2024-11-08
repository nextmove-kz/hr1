"use client";

import { extractTextFromPDF } from "@/utils/extractText";
import { getPDFDocument } from "@/utils/getPdfDocument";
import { useState, useEffect } from "react";

interface ParsedPDF {
  fileName: string;
  text: string;
}

let JSZip: any = null;

export const FileUploader = () => {
  const [parsedFiles, setParsedFiles] = useState<ParsedPDF[]>([]);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    import("jszip").then((module) => {
      JSZip = module.default;
    });
  }, []);

  const handleSinglePDF = async (file: File): Promise<ParsedPDF> => {
    const pdfDoc = await getPDFDocument(file);
    const text = await extractTextFromPDF(pdfDoc);
    return { fileName: file.name, text };
  };

  const handleZipFile = async (zipFile: File): Promise<ParsedPDF[]> => {
    if (!JSZip) {
      throw new Error("JSZip not loaded");
    }

    const zip = new JSZip();
    const zipContents = await zip.loadAsync(zipFile);
    const results: ParsedPDF[] = [];

    const pdfFiles = Object.entries(zipContents.files).filter(
      ([name, file]) => name.toLowerCase().endsWith(".pdf") && !file.dir
    );

    for (const [fileName, file] of pdfFiles) {
      try {
        const blob = await file.async("blob");

        const pdfFile = new File([blob], fileName, { type: "application/pdf" });

        const pdfDoc = await getPDFDocument(pdfFile);
        const text = await extractTextFromPDF(pdfDoc);

        results.push({ fileName, text });
      } catch (error) {
        console.error(`Error processing ${fileName}:`, error);
      }
    }

    return results;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    setParsedFiles([]);

    try {
      if (files[0].name.toLowerCase().endsWith(".zip")) {
        const results = await handleZipFile(files[0]);
        setParsedFiles(results);
      } else if (files[0].name.toLowerCase().endsWith(".pdf")) {
        const result = await handleSinglePDF(files[0]);
        setParsedFiles([result]);
      } else {
        throw new Error("Please upload a PDF or ZIP file");
      }
    } catch (error) {
      console.error("Error parsing files:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Error parsing files. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="file"
          accept=".pdf,.zip"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-600 file:text-white
            hover:file:bg-blue-700"
        />
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Processing files...</p>
        </div>
      )}

      {parsedFiles.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4">
            Processed {parsedFiles.length} file
            {parsedFiles.length !== 1 ? "s" : ""}
          </h2>
          {parsedFiles.map((file, index) => (
            <div key={index} className="mb-6 p-4 border rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2 text-blue-600">
                {file.fileName}
              </h3>
              <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
                {file.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
