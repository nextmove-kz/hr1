"use client";

import { extractTextFromPDF } from "@/utils/extractText";
import { getPDFDocument } from "@/utils/getPdfDocument";
import { useEffect, useState } from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Label } from "./ui/label";
import JSZip from "jszip";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { pocketbase } from "@/api/pocketbase";
import clientPocketBase from "@/api/client_pb";
import {
  ResumeRecord,
  ResumeResponse,
  ResumeStatusOptions,
  VacancyRecord,
  VacancyResponse,
} from "@/api/api_types";
import { zapros } from "@/api/ai/anthropic";
import { useToast } from "@/hooks/use-toast";

interface ParsedPDF {
  fileName: string;
  text: string;
  file: File;
}

export const FileUploader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const vacancyParam = pathname.split("/")[2];
  const vacancyId = vacancyParam ? vacancyParam.split("?")[0] : "";
  const [parsedFiles, setParsedFiles] = useState<ParsedPDF[]>([]);
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

        results.push({ fileName, text, file: pdfFile }); // Include the original file
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
    setProceessingFinished(false);

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

  const sendResume = async () => {
    if (parsedFiles.length > 2 || !vacancy) return;
    const chunks = chunkArray(parsedFiles);

    setProcessingAI(true);

    for (const chunk of chunks) {
      try {
        let aiResponse: ResumeRecord[] | ResumeRecord = await mockAI(chunk);
        if (!aiResponse) continue;
        aiResponse = aiResponse.splice(0, chunk.length);

        if (Array.isArray(aiResponse)) {
          for (let i = 0; i < aiResponse.length; i++) {
            const resume = aiResponse[i];
            const formData = new FormData();

            appendFormData(formData, resume);
            formData.append("resume", chunk[i].file);
            formData.append("vacancy", vacancy.id);

            await clientPocketBase.collection("resume").create(formData);
          }
        } else {
          const formData = new FormData();

          appendFormData(formData, aiResponse);

          formData.append("resume", chunk[0].file);
          formData.append("vacancy", vacancy.id);

          await clientPocketBase.collection("resume").create(formData);
        }
      } catch (error) {
        console.error("Error sending resume:", error);
        alert("Произошла ошибка при обработке резюме");
      } finally {
        setProcessingAI(false);
        router.refresh();
        toast({ title: "Файлы резюме загружены" });
        setProceessingFinished(true);
        setParsedFiles([]);
        setLoading(false);
      }
    }
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
  const mockAI = async (chunk: ParsedPDF[]) => {
    return [
      {
        fullName: "Луков Иван Дмитриевич",
        jobName: "Elixir Разработчик",
        rating: 40,
        pros:
          "Имеет опыт full-stack разработки\n" +
          "Знание современных технологий (React, TypeScript)\n" +
          "Высокий уровень английского языка (C1)\n" +
          "Опыт работы с Docker и базами данных",
        cons:
          "Основной опыт в Elixir и backend разработке, а не frontend\n" +
          "Недостаточный опыт работы (менее 2 лет)\n" +
          "Отсутствие законченного высшего образования\n" +
          "Несоответствие основного стека технологий требуемой позиции",
        summary:
          "Молодой специалист с опытом full-stack разработки, но основной фокус на backend-разработке с использованием Elixir. Несмотря на наличие навыков работы с frontend технологиями, кандидат имеет недостаточный опыт для позиции frontend разработчика и не полностью соответствует требованиям вакансии.",
      },
      {
        fullName: "Кожахметов Давид",
        jobName: "React Frontend Developer",
        rating: 55,
        pros:
          "Профильный опыт работы во frontend-разработке\n" +
          "Знание требуемых технологий (React, JavaScript)\n" +
          "Опыт работы с современными инструментами разработки\n" +
          "Релевантный опыт создания пользовательских интерфейсов",
        cons:
          "Недостаточный опыт работы (2 года вместо требуемых 3-6 лет)\n" +
          "Ограниченный стек используемых технологий\n" +
          "Незаконченное высшее образование\n" +
          "Короткий срок работы на последнем месте",
        summary:
          "Frontend-разработчик с профильным опытом в React-разработке и создании пользовательских интерфейсов. Несмотря на релевантный опыт работы, кандидат не достигает требуемого уровня опыта в 3-6 лет, что может быть существенным ограничением для данной позиции.",
      },
    ];
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Загрузите резюме</DialogTitle>
        <DialogDescription>
          Поддерживаемые форматы: .pdf для единичной загрузки, .zip для массовой
        </DialogDescription>
      </DialogHeader>
      <div className="grid w-full  items-center gap-1.5">
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

        {parsedFiles.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">
              Обработан{parsedFiles.length > 1 ? "о " : " "}{" "}
              {parsedFiles.length} {humanizeText(parsedFiles.length)}
            </h2>
            {parsedFiles.map((file, index) => (
              <div key={index} className="">
                <h3 className="text-md">{file.fileName}</h3>
                <p className="text-sm truncate text-gray-700">{file.text}</p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      {!proceessingFinished ? (
        <Button
          disabled={parsedFiles.length === 0 || processingAI}
          onClick={sendResume}
        >
          {processingAI ? "Оцениваем резюме... ✨" : "Загрузить"}
        </Button>
      ) : (
        <DialogClose asChild>
          <Button type="button" variant={"secondary"}>
            Закрыть
          </Button>
        </DialogClose>
      )}
    </DialogContent>
  );
};

const humanizeText = (length: number) => {
  if (length === 1) return "файл";
  if (length > 1 && length < 5) return "файла";
  if (length >= 5) return "файлов";
};
