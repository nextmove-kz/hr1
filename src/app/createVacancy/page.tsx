"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createVacancy } from "@/api/vacancy";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const page = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [employmentType, setemploymentType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState("");
  const [minSalary, setMinSalary] = useState<string>("");
  const [maxSalary, setMaxSalary] = useState<string>("");

  const submitData = () => {
    const result = createVacancy(data);
    if (result != null) {
      toast({
        description: "Вакансия успешно создана",
      });
    }
    setemploymentType("");
    setTitle("");
    setDescription("");
    setCity("");
    setExperience("");
    setMinSalary("");
    setMaxSalary("");
    router.refresh();
  };

  const data = {
    title: title,
    description: description,
    city: city,
    experience: experience,
    minSalary: minSalary,
    maxSalary: maxSalary,
    employment_type: employmentType,
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="w-[40%]">
        <CardHeader>
          <CardTitle>Создание вакансии</CardTitle>
          <CardDescription>
            Заполните поля для создания вакансии
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
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
                <Input
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
                <div className="flex ">
                  <Input
                    value={minSalary}
                    id="minSalary"
                    placeholder="Минимальная зарплата"
                    onChange={(event) => {
                      if (isNaN(+event.target.value)) return;
                      setMinSalary(event.target.value);
                    }}
                  />
                  <Input
                    value={maxSalary}
                    id="maxSalary"
                    placeholder="Максимальная зарплата"
                    onChange={(event) => {
                      if (isNaN(+event.target.value)) return;
                      setMaxSalary(event.target.value);
                    }}
                  />
                </div>
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
                    <DropdownMenuItem
                      onClick={() => setExperience("voluntary")}
                    >
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
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button id="submitButton" onClick={submitData} disabled={!title}>
            Создать
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
