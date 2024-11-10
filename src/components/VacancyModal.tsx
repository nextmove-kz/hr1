"use client";

import { Building2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "../components/ui/input";

import {
  ResumeResponse,
  VacancyEmploymentTypeOptions,
  VacancyExperienceOptions,
  VacancyRecord,
  VacancyResponse,
} from "@/api/api_types";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import clientPocketBase from "@/api/client_pb";
import { Textarea } from "./ui/textarea";
import { updateVacancy } from "@/api/vacancy";
import CloseVacancy from "./closeVacancy";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { useAtom } from "jotai";
import { buttonStatusAtom, inviteAtom } from "@/lib/atoms";
import { hireResume } from "@/api/resume";

interface Vacancy {
  title: string;
  description: string;
  city: string;
  experience: string;
  employment_type: string;
}

export default function VacancyModal() {
  const router = useRouter();
  const pathname = usePathname();
  const vacancyParam = pathname.split("/")[2];
  const vacancyId = vacancyParam ? vacancyParam.split("?")[0] : "";
  const [vacancy, setVacancy] = useState<VacancyResponse>();
  const [openEdit, setOpenEdit] = useState(false);
  const [resumes, setResumes] = useState<ResumeResponse[]>();
  const [activeResume, setActiveResume] = useState<ResumeResponse>();
  const [buttonStatus, setButtonStatus] = useAtom(buttonStatusAtom);
  const [reloadResumes, setReloadResumes] = useAtom(inviteAtom);

  const [employmentType, setemploymentType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState("");

  const submitData = () => {
    if (vacancy) {
      const result = updateVacancy(vacancy.id, data);
    }
    // if (result != null) {
    //   toast({
    //     description: "Вакансия успешно создана",
    //   });
    // }
    setemploymentType("");
    setTitle("");
    setDescription("");
    setCity("");
    setExperience("");
    window.location.reload();
  };

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

  const data: VacancyRecord = {
    title: title,
    description: description,
    city: city,
    experience:
      VacancyExperienceOptions[
        experience as keyof typeof VacancyExperienceOptions
      ],
    employment_type:
      VacancyEmploymentTypeOptions[
        employmentType as keyof typeof VacancyEmploymentTypeOptions
      ],
  };
  useEffect(() => {
    if (vacancyId) {
      clientPocketBase
        .collection("resume")
        .getFullList({
          filter: `vacancy = "${vacancyId}" && accepted = "invite"`,
        })
        .then((data) => {
          setResumes(data);
        });
    }
  }, [pathname]);
  useEffect(() => {
    if (vacancyId) {
      clientPocketBase
        .collection("vacancy")
        .getOne(vacancyId)
        .then((data) => {
          setVacancy(data);
          setTitle(data.title);
          setemploymentType(data.employment_type);
          setDescription(data.description);
          setCity(data.city);
          setExperience(data.experience);
        });
    }
  }, [pathname]);

  const experienceConvert = (experience: string) => {
    if (experience === "none") return "без опыта";
    if (experience === "3-6" || experience === "6+") return experience + " лет";
    return experience + " года";
  };
  const employmentConvert = (employment: string) => {
    const types = {
      full_time: "Полная занятость",
      part_time: "Частичная занятость",
      internship: "Стажировка",
      project: "Проект",
      voluntary: "Волонтерство",
    };

    return types[employment as keyof typeof types];
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold flex items-center gap-2">
            {vacancy?.title}
            {!vacancy?.archive && (
              <Button
                variant={"ghost"}
                className="p-2"
                onClick={() => {
                  if (openEdit == false) {
                    setOpenEdit(true);
                  } else {
                    setOpenEdit(false);
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  style={{ width: "20px", height: "20px" }}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        {openEdit == false ? (
          <>
            <div className="flex flex-wrap gap-3">
              {vacancy?.city && (
                <>
                  <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
                    <Building2 className="h-5 w-5 text-green-600" />
                    <span>{vacancy?.city}</span>
                  </div>
                </>
              )}
              {vacancy?.experience && (
                <>
                  {" "}
                  <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <span>
                      {experienceConvert(vacancy?.experience as string)}
                    </span>
                  </div>
                </>
              )}
              {vacancy?.employment_type && (
                <>
                  {" "}
                  <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span>
                      {employmentConvert(vacancy?.employment_type as string)}
                    </span>
                  </div>
                </>
              )}
            </div>
            <ScrollArea className="h-60">
              <div className="space-y-6">
                {vacancy?.description && (
                  <p
                    className="text-sm text-gray-600"
                    dangerouslySetInnerHTML={{ __html: vacancy?.description }}
                  ></p>
                )}
              </div>
            </ScrollArea>
            <div>
              <CloseVacancy item={vacancy as VacancyResponse} />
            </div>
          </>
        ) : (
          <>
            <form
              onSubmit={() => {
                submitData();
              }}
            >
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Input
                    value={title}
                    id="title"
                    placeholder="Название вакансии"
                    onChange={(event) => {
                      setTitle(event.target.value);
                    }}
                  />

                  <Textarea
                    value={description}
                    id="Description"
                    placeholder="Описание"
                    onChange={(event) => {
                      setDescription(event.target.value);
                    }}
                  />

                  <Input
                    value={city}
                    id="City"
                    placeholder="Город"
                    onChange={(event) => {
                      setCity(event.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {experience
                          ? experience == "none"
                            ? "Без опыта"
                            : experience == "1-3"
                            ? "1-3"
                            : experience == "3-6"
                            ? "3-6"
                            : "6+"
                          : "Опыт работы"}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5 pl-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setExperience("none")}>
                        Без опыта
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setExperience("1-3")}>
                        1-3
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setExperience("3-6")}>
                        3-6
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setExperience("6+")}>
                        6+
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {employmentType
                          ? employmentType == "full_time"
                            ? "Полная занятость"
                            : employmentType == "part_time"
                            ? "Частичная занятость"
                            : employmentType == "project"
                            ? "Проект"
                            : employmentType == "voluntary"
                            ? "Волонтерство"
                            : "Стажировка"
                          : "Тип занятости"}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5 pl-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => setemploymentType("full_time")}
                      >
                        Полная занятость
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setemploymentType("part_time")}
                      >
                        Частичная занятость
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setemploymentType("project")}
                      >
                        Проект
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setemploymentType("voluntary")}
                      >
                        Волонтерство
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setemploymentType("internship")}
                      >
                        Стажировка
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button type="submit">Сохранить</Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
