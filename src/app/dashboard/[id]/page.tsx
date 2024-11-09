"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { accept, getResume, reject } from "@/api/resume";

import { useEffect, useState } from "react";
import { ResumeResponse } from "@/api/api_types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const DashboardPage = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [resumes, setResumes] = useState<ResumeResponse[]>([]);
  const [filteredResumes, setFilteredResumes] = useState<ResumeResponse[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const data = await getResume(id);
        if (!data) return;
        setResumes(data);
      } catch (error) {
        console.error("Ошибка при получении данных о резюме:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const filterData = () => {
      if (statusFilter === "") {
        const filtered = resumes.filter((resume) => !resume.status);
        filtered.sort((a, b) => b.rating - a.rating);
        setFilteredResumes(filtered);
      } else {
        const filtered = resumes.filter(
          (resume) => resume.status === statusFilter
        );
        filtered.sort((a, b) => b.rating - a.rating);
        setFilteredResumes(filtered);
      }
    };
    filterData();
  }, [statusFilter, resumes]);
  const getRatingColor = (rating: number) => {
    if (rating >= 90) return "text-green-500";
    if (rating >= 70) return "text-yellow-500";
    if (rating >= 60) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="">
      <div className="flex-1 p-6">
        <div className="flex text-xl font-semibold mb-4 justify-between">
          <h1>Резюме ({filteredResumes.length} подходящих)</h1>
          <div className="flex gap-2">
            <select
              className="bg-transparent border px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Без статуса</option>
              <option value="accept">Принятые</option>
              <option value="reject">Отклоненные</option>
            </select>
            <Button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={statusFilter ? "#fff" : "none"}
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-6 text-white"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                />
              </svg>
            </Button>
          </div>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {filteredResumes.map((resume: ResumeResponse) => (
            <AccordionItem key={resume.id} value={`resume-${resume.id}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex justify-between items-center w-full">
                  <span className="text-lg font-medium">
                    {resume?.fullName}
                  </span>
                  <div className="flex items-center gap-2 mr-5">
                    <div className="relative w-10 h-10 ">
                      <svg className="w-full h-full " viewBox="0 0 100 100">
                        <circle
                          className="text-gray-200 stroke-current"
                          stroke-width="10"
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                        ></circle>{" "}
                        <circle
                          className={`${getRatingColor(
                            resume.rating
                          )} progress-ring__circle stroke-current`}
                          stroke-width="10"
                          stroke-linecap="round"
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke-dasharray="251.2"
                          stroke-dashoffset="calc(251.2px - (251.2px * 70) / 100)"
                        ></circle>
                        <text
                          x="50"
                          y="50"
                          font-size="32"
                          text-anchor="middle"
                          alignment-baseline="middle"
                          className="flex font-semibold items-center justify-center"
                        >
                          {resume.rating}
                        </text>
                      </svg>
                    </div>
                    {!resume.status && (
                      <div className="flex items-center gap-2 border border-gray-200 rounded-full p-1">
                        <button onClick={() => accept(resume.id)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="size-6 hover:text-green-500 transition-all 0.5s"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="m4.5 12.75 6 6 9-13.5"
                            />
                          </svg>
                        </button>
                        <button onClick={() => reject(resume.id)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="size-6 hover:text-gray-500 transition-all 0.5s"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <div className="flex gap-6">
                    <div className="">
                      {resume.pros
                        .split(", ")
                        .map((pro: string, index: number) => (
                          <div key={index} className="text-sm text-green-600">
                            {pro}
                          </div>
                        ))}
                    </div>
                    <div className="">
                      {resume.cons
                        .split(", ")
                        .map((con: string, index: number) => (
                          <div key={index} className="text-sm text-red-600">
                            {con}
                          </div>
                        ))}
                    </div>
                  </div>
                  <Separator />
                  {resume.summary && (
                    <div className="text-sm text-muted-foreground">
                      Заключение: {resume.summary}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default DashboardPage;
