import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getPDFDocument } from "@/utils/getPdfDocument";
import { extractTextFromPDF } from "@/utils/extractText";

interface ParsedPDF {
  fileName: string;
  text: string;
}

export const ResumeParser = () => {
  const [parsedFiles, setParsedFiles] = useState<ParsedPDF[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const cookie = `regions=177; display=desktop; GMT=5; uxs_uid=9d744980-fb0b-11ee-84ba-bff6574d2bb1; __ddg1_=oUDzyLoOkS5mU66FiaUH; _xsrf=740ecddaf7c0b4c930e86ed17275885c; redirect_host=karaganda.hh.kz; hhuid=IbyeIXieyq4D0Gcvw1M3BQ--; region_clarified=NOT_SET; hhul=ce3c57a8f622630857cfa76b5ebd75b8d8d70340bfa56038671067e97fbb96a6; hhtoken=QerqhKliFgnlJl7UXf5!2d2goGdW; _hi=172186635; hhrole=employer; __zzatgib-w-hh=MDA0dC0jViV+FmELHw4/aQsbSl1pCENQGC9LX3UqQR8jZkoWInVdUwgtTxR5JyxPDz8ZcnYneSxwIiNoOVURCxIXRF5cVWl1FRpLSiVueCplJS0xViR8SylEXFB6JiEUfG4mTwwRVy8NPjteLW8PKhMjZHYhP04hC00+KlwVNk0mbjN3RhsJHlksfEspNVZ/eygbGnpsLFgNDV9Fdyp5X3FrTl97FSN5Ewg0LEsZM2wmUhANXj4zaWVpcC9gIBIlEU1HGEVkW0I2KBVLcU8cenZffSpCaB5gT1wkRlhNficVe0M8YwxxFU11cjgzGxBhDyMOGFgJDA0yaFF7CT4VHThHKHIzd2UqQmceZ01fIkhHSWtlTlNCLGYbcRVNCA00PVpyIg9bOSVYCBI/CyYgFHhsK1IMDl49RnNvG382XRw5YxEOIRdGWF17TEA=RjsaxA==; __zzatgib-w-hh=MDA0dC0jViV+FmELHw4/aQsbSl1pCENQGC9LX3UqQR8jZkoWInVdUwgtTxR5JyxPDz8ZcnYneSxwIiNoOVURCxIXRF5cVWl1FRpLSiVueCplJS0xViR8SylEXFB6JiEUfG4mTwwRVy8NPjteLW8PKhMjZHYhP04hC00+KlwVNk0mbjN3RhsJHlksfEspNVZ/eygbGnpsLFgNDV9Fdyp5X3FrTl97FSN5Ewg0LEsZM2wmUhANXj4zaWVpcC9gIBIlEU1HGEVkW0I2KBVLcU8cenZffSpCaB5gT1wkRlhNficVe0M8YwxxFU11cjgzGxBhDyMOGFgJDA0yaFF7CT4VHThHKHIzd2UqQmceZ01fIkhHSWtlTlNCLGYbcRVNCA00PVpyIg9bOSVYCBI/CyYgFHhsK1IMDl49RnNvG382XRw5YxEOIRdGWF17TEA=RjsaxA==; gsscgib-w-hh=cBxL0raGIE4s2+bhxwZGU0qfzXR6tir0xiEsKpkTGFF0Luwje89yBPy0UBLlEZdWgPRMcBp+rHUMeK5bHwqgbPHO8XJWmz33qx1PFFzXmGcFeg3hHcWtM3tug9+xtrefmR3kz0/FpGJzmcOGlrrM+s+BrQMBV5xT5RdAECjFtzz1gwwGvJi4exv+yziz9nKiC9Mdm2bOgyeEH0+K6vZ+/pbtJi5UaV/a0umWQyZBZgJ5HonNz5mEhzcLP23Vhg==; cfidsgib-w-hh=jt8mOUnFun4KFW/nhlDNQgujvJn015R0JYjWStljoQwGPcdhlTa+S9JjzUn29+cliEdUY7szlB6jjCma2EDD06o/TTBaTZhXnPt4PjnqoTTKfJznif8Rfved4k7vQ/wab09rw+ElY+cpS6RPQ7xLHFWIyIVOq7jE468s/Tc=; cfidsgib-w-hh=jt8mOUnFun4KFW/nhlDNQgujvJn015R0JYjWStljoQwGPcdhlTa+S9JjzUn29+cliEdUY7szlB6jjCma2EDD06o/TTBaTZhXnPt4PjnqoTTKfJznif8Rfved4k7vQ/wab09rw+ElY+cpS6RPQ7xLHFWIyIVOq7jE468s/Tc=; cfidsgib-w-hh=jt8mOUnFun4KFW/nhlDNQgujvJn015R0JYjWStljoQwGPcdhlTa+S9JjzUn29+cliEdUY7szlB6jjCma2EDD06o/TTBaTZhXnPt4PjnqoTTKfJznif8Rfved4k7vQ/wab09rw+ElY+cpS6RPQ7xLHFWIyIVOq7jE468s/Tc=; gsscgib-w-hh=cBxL0raGIE4s2+bhxwZGU0qfzXR6tir0xiEsKpkTGFF0Luwje89yBPy0UBLlEZdWgPRMcBp+rHUMeK5bHwqgbPHO8XJWmz33qx1PFFzXmGcFeg3hHcWtM3tug9+xtrefmR3kz0/FpGJzmcOGlrrM+s+BrQMBV5xT5RdAECjFtzz1gwwGvJi4exv+yziz9nKiC9Mdm2bOgyeEH0+K6vZ+/pbtJi5UaV/a0umWQyZBZgJ5HonNz5mEhzcLP23Vhg==; gsscgib-w-hh=cBxL0raGIE4s2+bhxwZGU0qfzXR6tir0xiEsKpkTGFF0Luwje89yBPy0UBLlEZdWgPRMcBp+rHUMeK5bHwqgbPHO8XJWmz33qx1PFFzXmGcFeg3hHcWtM3tug9+xtrefmR3kz0/FpGJzmcOGlrrM+s+BrQMBV5xT5RdAECjFtzz1gwwGvJi4exv+yziz9nKiC9Mdm2bOgyeEH0+K6vZ+/pbtJi5UaV/a0umWQyZBZgJ5HonNz5mEhzcLP23Vhg==; __ddg9_=178.88.114.115; __ddg10_=1731183554; __ddg8_=C3rpb54NxRrU5nlc; device_magritte_breakpoint=xs; device_breakpoint=xs; fgsscgib-w-hh=16aV64c1ffde92fb2c3f8de6ef19bd69d0e717b0; fgsscgib-w-hh=16aV64c1ffde92fb2c3f8de6ef19bd69d0e717b0`;

  const fetchPDFViaProxy = async (url: string): Promise<Blob> => {
    const response = await fetch("/api/pdf-proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        requestCookie: cookie,
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch PDF");
    }

    const contentType = response.headers.get("Content-Type");
    if (!contentType?.includes("application/pdf")) {
      throw new Error("Response is not a PDF");
    }

    return response.blob();
  };

  const fetchAndProcessPDFs = async () => {
    setLoading(true);
    setParsedFiles([]);

    try {
      // Use the custom cookie header
      const response = await fetch("/api/parser", {
        headers: {
          requestCookie: cookie,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch PDF links");
      }

      // Process PDFs in smaller batches to avoid overwhelming the server
      const BATCH_SIZE = 3;
      for (let i = 0; i < data.links.length; i += BATCH_SIZE) {
        const batch = data.links.slice(i, i + BATCH_SIZE);

        await Promise.all(
          batch.map(async (url: string) => {
            try {
              const pdfBlob = await fetchPDFViaProxy(url);
              const fileName = decodeURIComponent(
                url.split("/").pop()?.split("?")[0] || "unknown.pdf"
              );

              const pdfFile = new File([pdfBlob], fileName, {
                type: "application/pdf",
              });
              const pdfDoc = await getPDFDocument(pdfFile);
              const text = await extractTextFromPDF(pdfDoc);

              parsedFiles.push({ fileName, text });
              setParsedFiles((current) => [...current, { fileName, text }]);
            } catch (error) {
              console.error(`Error processing PDF from ${url}:`, error);
              toast({
                variant: "destructive",
                title: `Error processing ${url}`,
                description:
                  error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
              });
            }
          })
        );
      }

      if (parsedFiles.length === 0) {
        throw new Error("No PDFs were successfully processed");
      }

      toast({
        title: `Successfully processed ${parsedFiles.length} resumes`,
      });
    } catch (error) {
      console.error("Error in PDF processing:", error);
      toast({
        variant: "destructive",
        title: "Error processing resumes",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const humanizeText = (length: number) => {
    if (length === 1) return "файл";
    if (length > 1 && length < 5) return "файла";
    if (length >= 5) return "файлов";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-4">
      <CardContent>
        <div className="flex flex-col gap-4">
          <Button
            onClick={fetchAndProcessPDFs}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing PDFs... ({parsedFiles.length} done)
              </div>
            ) : (
              "Parse Resumes"
            )}
          </Button>

          <ScrollArea className="max-h-[60vh]">
            {parsedFiles.length > 0 && (
              <div className="mt-4 space-y-4">
                <h2 className="text-xl font-semibold">
                  Processed {parsedFiles.length}{" "}
                  {humanizeText(parsedFiles.length)}
                </h2>

                {parsedFiles.map((file, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="text-md font-medium">{file.fileName}</h3>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                      {file.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeParser;
