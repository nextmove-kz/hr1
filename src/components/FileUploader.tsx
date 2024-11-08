"use client";

import { extractTextFromPDF } from "@/utils/extractText";
import { getPDFDocument } from "@/utils/getPdfDocument";
import { useState } from "react";
import { DialogContent, DialogDescription, DialogHeader } from "./ui/dialog";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Label } from "./ui/label";
import JSZip from "jszip";

interface ParsedPDF {
  fileName: string;
  text: string;
}

export const FileUploader = () => {
  const [parsedFiles, setParsedFiles] = useState<ParsedPDF[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <DialogContent>
      <DialogHeader>Загрузите резюме</DialogHeader>
      <DialogDescription>
        Поддерживаемые форматы: .pdf для единичной загрузки, .zip для массовой
      </DialogDescription>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>Выберите файл</Label>
        <Input
          type="file"
          accept=".pdf,.zip"
          onChange={handleFileChange}
          placeholder="Выберите файл"
        />
      </div>

      <ScrollArea className="max-h-[60vh]">
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
                <div className="bg-gray-50 p-4 rounded truncate">
                  {file.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </DialogContent>
  );
};
