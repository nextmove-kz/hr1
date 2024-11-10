import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { getPDFDocument } from "@/utils/getPdfDocument";
import { extractTextFromPDF } from "@/utils/extractText";
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Input } from "./ui/input";
import { usePathname, useRouter } from "next/navigation";
import clientPocketBase from "@/api/client_pb";
import { ResumeRecord, VacancyResponse } from "@/api/api_types";
import { zapros } from "@/api/ai/anthropic";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

interface ParsedPDF {
  fileName: string;
  text: string;
  file?: File;
}

interface ProcessedResume extends ResumeRecord {
  id?: string;
  resume?: string;
}

export const ResumeParser = () => {
  const [parsedFiles, setParsedFiles] = useState<ParsedPDF[]>([]);
  const [processedResumes, setProcessedResumes] = useState<ProcessedResume[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [inputLink, setInputLink] = useState("");
  const [submittedLink, setSubmittedLink] = useState("");
  const [processingAI, setProcessingAI] = useState(false);
  const [proceessingFinished, setProceessingFinished] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const vacancyId = pathname.split("/")[2]?.split("?")[0];
  const [vacancy, setVacancy] = useState<VacancyResponse>();

  React.useEffect(() => {
    if (vacancyId) {
      clientPocketBase
        .collection("vacancy")
        .getOne(vacancyId)
        .then((data) => {
          setVacancy(data);
        });
    }
  }, [pathname]);

  const appendFormData = (formData: FormData, data: Record<string, any>) => {
    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }

      if (typeof value === "string" || typeof value === "boolean") {
        formData.append(key, String(value));
      } else if (typeof value === "number") {
        formData.append(key, value.toString());
      } else if (Array.isArray(value) || typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      }
    });
  };

  const chunkArray = (arr: ParsedPDF[], size = 3) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const sendToAI = async (chunk: ParsedPDF[]) => {
    if (!vacancy) return;
    const formattedChunk = chunk
      .map((file, index) => {
        return `<resume${index}>${file.text}</resume${index}>`;
      })
      .join("\n");
    return zapros(vacancy, formattedChunk);
  };

  const fetchPDFViaProxy = async (url: string): Promise<Blob> => {
    const response = await fetch("/api/pdf-proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedLink(inputLink);
    setLoading(true);
    setParsedFiles([]);

    let successfulFiles = 0;

    try {
      const response = await fetch("/api/parser");

      let data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch PDF links");
      }

      data.links = data.links.slice(0, 10);

      const BATCH_SIZE = 3;
      for (let i = 0; i < data.links.length; i += BATCH_SIZE) {
        const batch = data.links.slice(i, i + BATCH_SIZE);

        const batchResults = await Promise.all(
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

              successfulFiles++;
              return { fileName, text, file: pdfFile };
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
              return null;
            }
          })
        );

        const successfulBatch = batchResults.filter(
          (result): result is ParsedPDF => result !== null
        );
        setParsedFiles((current) => [...current, ...successfulBatch]);
      }

      if (successfulFiles === 0) {
        throw new Error("No PDFs were successfully processed");
      }

      toast({
        title: `Successfully processed ${successfulFiles} ${humanizeText(
          successfulFiles
        )}`,
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
  const getRatingColor = (rating: number) => {
    if (rating >= 80) return "text-green-500";
    if (rating >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getDashArray = (rating: number) => {
    return `${(rating / 100) * 251.2} 251.2`;
  };

  const sendResume = async () => {
    if (!vacancy) return;
    const chunks = chunkArray(parsedFiles);
    const totalChunks = chunks.length;

    setProcessingAI(true);

    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      const chunk = chunks[chunkIndex];
      try {
        toast({
          title: `Анализ резюме ${chunkIndex * 3 + 1}-${Math.min(
            (chunkIndex + 1) * 3,
            parsedFiles.length
          )}`,
          description: `Обработано ${chunkIndex + 1} из ${totalChunks} пакетов`,
        });

        let aiResponse: ResumeRecord[] | undefined = await sendToAI(chunk);
        if (!aiResponse) continue;
        aiResponse = aiResponse.splice(0, chunk.length);

        if (Array.isArray(aiResponse)) {
          const newProcessedResumes = await Promise.all(
            aiResponse.map(async (resume, i) => {
              const file = chunk[i].file;

              if (!(file instanceof File)) {
                console.warn(`No file available for resume ${i}`);
                return null;
              }

              const formData = new FormData();
              appendFormData(formData, resume);
              formData.append("resume", file);
              formData.append("vacancy", vacancy.id);

              const response = await clientPocketBase
                .collection("resume")
                .create(formData);
              return { ...resume, id: response.id, resume: file.name };
            })
          );

          setProcessedResumes((prev) => [
            ...prev,
            ...(newProcessedResumes.filter(Boolean) as ProcessedResume[]),
          ]);
        }

        toast({
          title: `Успешно обработано ${chunk.length} резюме`,
          description: `Пакет ${
            chunkIndex + 1
          } из ${totalChunks} загружен в базу данных`,
        });
      } catch (error) {
        console.error("Error sending resume:", error);
        toast({
          variant: "destructive",
          title: "Ошибка обработки",
          description: `Ошибка при обработке пакета ${
            chunkIndex + 1
          } из ${totalChunks}`,
        });
      }
    }

    router.refresh();
    toast({
      title: "Обработка завершена ✨",
      description: `Успешно проанализировано и загружено ${parsedFiles.length} резюме`,
    });
    setProceessingFinished(true);
    setProcessingAI(false);
    setLoading(false);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Получение резюме с HeadHunter</DialogTitle>
        <DialogDescription>
          Добавьте ссылку на список соискателей чтобы ИИ подобрал резюме для
          вакансии
        </DialogDescription>
      </DialogHeader>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {submittedLink ? (
          <a
            href={submittedLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline break-all"
          >
            {submittedLink}
          </a>
        ) : (
          <Input
            value={inputLink}
            onChange={(e) => setInputLink(e.target.value)}
            placeholder="Например: https://hh.kz/employer/vacancy/110466030"
            required
          />
        )}

        {parsedFiles.length === 0 && (
          <Button disabled={loading} className="w-full" type="submit">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Обработка PDFs... ({parsedFiles.length} готово)
              </div>
            ) : (
              "Собрать резюме"
            )}
          </Button>
        )}

        <ScrollArea className="max-h-[60vh]">
          {processedResumes.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4">
              {processedResumes.map((resume, index) => (
                <AccordionItem key={index} value={`resume-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-lg font-medium">
                        {resume.fullName}
                      </span>
                      <div className="flex items-center gap-2 mr-5">
                        {resume.rating && (
                          <div className="relative w-10 h-10">
                            <svg
                              className="w-full h-full"
                              viewBox="0 0 100 100"
                            >
                              <circle
                                className="text-gray-200 stroke-current"
                                strokeWidth="10"
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                              ></circle>
                              <circle
                                className={`${getRatingColor(
                                  resume.rating
                                )} progress-ring__circle stroke-current`}
                                strokeWidth="10"
                                strokeLinecap="round"
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                strokeDasharray={getDashArray(resume.rating)}
                                strokeDashoffset="calc(251.2px - (251.2px * 70) / 100)"
                              ></circle>
                              <text
                                x="50"
                                y="50"
                                fontSize="32"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                className="font-semibold"
                              >
                                {resume.rating}
                              </text>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {resume.cons && resume.pros && (
                        <>
                          <div className="flex gap-6">
                            <div>
                              {resume.pros.split("\n").map((pro, index) => (
                                <div
                                  key={index}
                                  className="text-sm text-green-600"
                                >
                                  <p>+ {pro}</p>
                                </div>
                              ))}
                            </div>
                            <div>
                              {resume.cons.split("\n").map((con, index) => (
                                <div
                                  key={index}
                                  className="text-sm text-red-600"
                                >
                                  <p>- {con}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <Separator />
                        </>
                      )}
                      {resume.summary && (
                        <div className="text-sm text-muted-foreground">
                          Краткое описание: {resume.summary}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            parsedFiles.length > 0 && (
              <div className="mt-4 space-y-4">
                <h2 className="text-xl font-semibold">
                  Обработано {parsedFiles.length}{" "}
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
            )
          )}
        </ScrollArea>

        {!proceessingFinished && parsedFiles.length > 0 ? (
          <Button
            disabled={parsedFiles.length === 0 || processingAI}
            onClick={sendResume}
            className="mt-4"
          >
            {processingAI ? "Оцениваем резюме... ✨" : "Отправить на анализ"}
          </Button>
        ) : proceessingFinished ? (
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Закрыть
            </Button>
          </DialogClose>
        ) : null}
      </form>
    </DialogContent>
  );
};

export default ResumeParser;
