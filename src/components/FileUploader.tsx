import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "./ui/scroll-area";
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
import { Label } from "./ui/label";
import JSZip from "jszip";
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
  file: File;
}

interface ProcessedResume extends ResumeRecord {
  id?: string;
  resume?: string;
}

export const FileUploader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const vacancyParam = pathname.split("/")[2];
  const vacancyId = vacancyParam ? vacancyParam.split("?")[0] : "";
  const [parsedFiles, setParsedFiles] = useState<ParsedPDF[]>([]);
  const [processedResumes, setProcessedResumes] = useState<ProcessedResume[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [vacancy, setVacancy] = useState<VacancyResponse>();
  const [processingAI, setProcessingAI] = useState(false);
  const [proceessingFinished, setProceessingFinished] = useState(false);

  useEffect(() => {
    setParsedFiles([]);
    setLoading(false);

    if (vacancyId) {
      clientPocketBase
        .collection("vacancy")
        .getOne(vacancyId)
        .then((data) => {
          setVacancy(data);
        });
    }
  }, [pathname]);

  const handleSinglePDF = async (file: File): Promise<ParsedPDF> => {
    const pdfDoc = await getPDFDocument(file);
    const text = await extractTextFromPDF(pdfDoc);
    return { fileName: file.name, text, file };
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

        results.push({ fileName, text, file: pdfFile });
      } catch (error) {
        console.error(`Error processing ${fileName}:`, error);
      }
    }

    return results;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!vacancy) return;
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    setParsedFiles([]);
    setProcessedResumes([]);
    setProceessingFinished(false);

    try {
      if (files[0].name.toLowerCase().endsWith(".zip")) {
        const results = await handleZipFile(files[0]);
        setParsedFiles(results);
      } else if (files[0].name.toLowerCase().endsWith(".pdf")) {
        const result = await handleSinglePDF(files[0]);
        setParsedFiles([result]);
      } else {
        throw new Error("Пожалуйста, загрузите PDF или ZIP файл");
      }
    } catch (error) {
      console.error("Error parsing files:", error);
      toast({
        variant: "destructive",
        title: "Ошибка обработки файлов",
        description:
          error instanceof Error ? error.message : "Неизвестная ошибка",
      });
    } finally {
      setLoading(false);
    }
  };

  const chunkArray = (arr: ParsedPDF[], size = 3) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const appendFormData = (formData: FormData, data: Record<string, any>) => {
    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      if (typeof value === "string" || typeof value === "boolean") {
        formData.append(key, String(value));
      } else if (typeof value === "number") {
        formData.append(key, value.toString());
      } else if (Array.isArray(value) || typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      }
    });
  };

  const sendToAI = async (chunk: ParsedPDF[]) => {
    if (!vacancy) return;
    const formattedChunk = chunk
      .map((file, index) => `<resume${index}>${file.text}</resume${index}>`)
      .join("\n");
    return zapros(vacancy, formattedChunk);
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
              const formData = new FormData();
              appendFormData(formData, resume);
              formData.append("resume", chunk[i].file);
              formData.append("vacancy", vacancy.id);
              console.log("Form Data", JSON.stringify(formData.entries()));

              const response = await clientPocketBase
                .collection("resume")
                .create(formData);
              return { ...resume, id: response.id, resume: chunk[i].file.name };
            })
          );

          setProcessedResumes((prev) => [...prev, ...newProcessedResumes]);
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

  const humanizeText = (length: number) => {
    if (length === 1) return "файл";
    if (length > 1 && length < 5) return "файла";
    if (length >= 5) return "файлов";
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Загрузите резюме</DialogTitle>
        <DialogDescription>
          Поддерживаемые форматы: .pdf для единичной загрузки, .zip для массовой
        </DialogDescription>
      </DialogHeader>
      <div className="grid w-full items-center gap-1.5">
        <Label>Выберите файл</Label>
        <Input type="file" accept=".pdf,.zip" onChange={handleFileChange} />
      </div>

      <ScrollArea className="max-h-[60vh]">
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Идет обработка файлов...</p>
          </div>
        )}

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
                          <svg className="w-full h-full" viewBox="0 0 100 100">
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

      {!proceessingFinished ? (
        <Button
          disabled={parsedFiles.length === 0 || processingAI}
          onClick={sendResume}
          className="mt-4"
        >
          {processingAI ? "Оцениваем резюме... ✨" : "Загрузить"}
        </Button>
      ) : (
        <DialogClose asChild>
          <Button type="button" variant="secondary" className="mt-4">
            Закрыть
          </Button>
        </DialogClose>
      )}
    </DialogContent>
  );
};

export default FileUploader;
