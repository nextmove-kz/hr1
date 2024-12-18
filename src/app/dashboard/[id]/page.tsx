"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { accept, getResume, reject } from "@/api/resume";
import { useEffect, useState } from "react";
import { Badge } from "../../../components/ui/badge";

import {
  ResumeResponse,
  VacancyRecord,
  VacancyResponse,
} from "@/api/api_types";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSubContent,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import CloseVacancy from "@/components/closeVacancy";
import { vacancyById } from "@/api/vacancy";
import VacancyModal from "@/components/VacancyModal";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function DashboardPage({ params }: { params: { id: string } }) {
  const [sliderValue, setSliderValue] = useState<any>();
  const [experienceState, setExperienceState] = useState("");
  const [educationState, setEducationState] = useState("");
  const [cityState, setCityState] = useState("");
  const id = params.id;
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeResponse[]>([]);
  const [filteredResumes, setFilteredResumes] = useState<ResumeResponse[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [vacancy, setVacancy] = useState<VacancyRecord>();
  const [reloadResumes, setReloadResumes] = useState<boolean>(false);

  useEffect(() => {
    router.refresh();

    const fetchData = async () => {
      if (!id) return;
      try {
        setVacancy(await vacancyById(params.id));
        const data = await getResume(id);
        if (!data) return;
        setResumes(data);
      } catch (error) {
        console.error("Ошибка при получении данных о резюме:", error);
      }
    };

    fetchData();
  }, [id, router, reloadResumes]);

  useEffect(() => {
    let filtered = resumes;

    if (statusFilter === "") {
      filtered = filtered.filter((resume) => !resume.status);
    } else if (statusFilter !== "all") {
      filtered = filtered.filter((resume) => resume.status === statusFilter);
    }

    if (educationState) {
      const educationCheck = educationState === "true";
      filtered = filtered.filter(
        (resume) => resume.education === educationCheck
      );
    }

    if (cityState) {
      filtered = filtered.filter((resume) => resume.city === cityState);
    }

    if (sliderValue) {
      filtered = filtered.filter((resume) => resume.rating >= +sliderValue);
    }

    if (experienceState) {
      if (experienceState === "none") {
        filtered = filtered.filter((resume) => resume.experience === "none");
      } else if (experienceState === "1-3") {
        filtered = filtered.filter((resume) => resume.experience === "1-3");
      } else if (experienceState === "3-6") {
        filtered = filtered.filter((resume) => resume.experience === "3-6");
      } else if (experienceState === "6+") {
        filtered = filtered.filter((resume) => resume.experience === "6+");
      }
    }

    filtered.sort((a, b) => b.rating - a.rating);

    setFilteredResumes(filtered);

    router.refresh();
  }, [
    statusFilter,
    educationState,
    experienceState,
    resumes,
    cityState,
    sliderValue,
  ]);

  const getRatingColor = (rating: number) => {
    if (rating >= 90) return "text-green-500";
    if (rating >= 70) return "text-yellow-500";
    if (rating >= 60) return "text-orange-500";
    return "text-red-500";
  };
  const getDashArray = (rating: number) => {
    if (rating >= 90) return 390;
    if (rating >= 80) return 320;
    if (rating >= 70) return 270;
    if (rating >= 60) return 210;
    return 150;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    router.refresh();
  };

  if (!vacancy) return;

  return (
    <div className="">
      <div className="flex-1 p-6">
        <div className="grid md:grid-cols-2 gap-y-2 grid-cols-1 text-xl font-semibold mb-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="">
              <div className="flex flex-col  gap-2">
                <h1>{vacancy && vacancy.title}</h1>
                <p className="text-sm">
                  {sliderValue && (
                    <>Минимальный процент соответствия: {sliderValue}</>
                  )}
                </p>
              </div>

              {/* <Slider
                defaultValue={sliderValue}
                onValueChange={(value) => {
                  setSliderValue(value);
                }}
                max={100}
                step={1}
              /> */}
              {vacancy.archive && (
                <>
                  <Badge variant="destructive">В архиве</Badge>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-start md:justify-end">
            <VacancyModal />

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>Фильтры</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-col gap-1">
                <Input
                  value={sliderValue}
                  placeholder="Рейтинг %"
                  type="number"
                  onChange={(event) => {
                    if (+event.target.value > 100) return;
                    if (+event.target.value < 0) return;
                    setSliderValue(event.target.value);
                  }}
                ></Input>
                <Input
                  placeholder="Город"
                  onChange={(event) => {
                    setCityState(event.target.value);
                  }}
                ></Input>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Опыт работы</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup
                        value={experienceState}
                        onValueChange={setExperienceState}
                      >
                        <DropdownMenuRadioItem value="none">
                          Без опыта
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="1-3">
                          1-3
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="3-6">
                          3-6
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="6+">
                          6+
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Высшее образование</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup
                        value={educationState}
                        onValueChange={setEducationState}
                      >
                        <DropdownMenuRadioItem value="true">
                          Да
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="false">
                          Нет
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            <select
              className="bg-transparent border px-1 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
              value={statusFilter}
              onChange={handleChange}
            >
              <option value="">Без статуса</option>
              <option value="accept">Принятые</option>
              <option value="reject">Отклоненные</option>
              <option value="all">Все</option>
            </select>
          </div>
        </div>

        <Accordion type="single" collapsible className="space-y-4 mr-10">
          {filteredResumes.length > 0 ? (
            filteredResumes.map((resume: ResumeResponse) => (
              <AccordionItem key={resume.id} value={`resume-${resume.id}`}>
                {!resume.status && (
                  <div className="absolute right-[10px] flex flex-col items-center gap-2 border border-gray-200 rounded-full p-1">
                    {!vacancy.archive && (
                      <>
                        {" "}
                        <button
                          onClick={() =>
                            accept(resume.id).then(() =>
                              setReloadResumes((prev) => !prev)
                            )
                          }
                        >
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
                      </>
                    )}
                    {!vacancy.archive && (
                      <>
                        {" "}
                        <button
                          onClick={() =>
                            reject(resume.id).then(() =>
                              setReloadResumes((prev) => !prev)
                            )
                          }
                        >
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
                      </>
                    )}
                  </div>
                )}
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-lg font-medium gap-2 flex">
                      {resume?.fullName}
                    </span>
                    <div className="flex items-center gap-2 mr-5">
                      <div className="flex flex-col">
                        <div className="flex gap-1 justify-end">
                          <p>Hard:</p>
                          {resume.resumeHard}
                        </div>
                        <div className="flex gap-1 justify-end">
                          <p>Soft:</p>
                          {resume.resumeSoft}
                        </div>
                      </div>
                      <div className="relative w-10 h-10 ">
                        <svg className="w-full h-full " viewBox="0 0 100 100">
                          <circle
                            className="text-gray-200 stroke-current"
                            strokeWidth="10"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                          ></circle>{" "}
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
                            stroke-dasharray={getDashArray(resume.rating)}
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
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex gap-2">
                    {resume.city && (
                      <Badge variant="outline">{resume.city}</Badge>
                    )}
                    {resume.experience && (
                      <Badge variant="outline">{resume.experience}</Badge>
                    )}
                    {resume.education == true ? (
                      <Badge>Есть высшее образование</Badge>
                    ) : (
                      <Badge variant="destructive">
                        Нет высшего образования
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex gap-6">
                      <div>
                        {resume.pros
                          .split("\n")
                          .map((pro: string, index: number) => (
                            <div key={index} className="text-sm text-green-600">
                              <p>+ {pro}</p>
                            </div>
                          ))}
                      </div>
                      <div>
                        {resume.cons
                          .split("\n")
                          .map((con: string, index: number) => (
                            <div key={index} className="text-sm text-red-600">
                              <p>- {con}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                    <Separator />
                    {resume.summary && (
                      <div className="text-sm text-muted-foreground">
                        Краткое описание: {resume.summary}
                      </div>
                    )}
                    <Link
                      href={`https://pocketbase.nextmove.kz/api/files/fqb2dmpp193fo7f/${resume.id}/${resume.resume}`}
                      target="_blank"
                      className="rounded-3xl h-8 w-10 text-blue-500 hover:text-blue-700 hover:underline transition-all 0.3s"
                    >
                      Посмотреть резюме
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))
          ) : (
            <p>Нет резюме для этой вакансии, попробуйте добавить</p>
          )}
        </Accordion>
      </div>
    </div>
  );
}
