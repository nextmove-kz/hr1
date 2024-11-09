"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PlusCircleIcon } from "@heroicons/react/16/solid";

import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { createVacancy } from "@/api/vacancy";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

const ButtonCreate = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [employmentType, setemploymentType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState("");

  const submitData = () => {
    const result = createVacancy(data);
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

  const data = {
    title: title,
    description: description,
    city: city,
    experience: experience,
    employment_type: employmentType,
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-auto w-full">
          <PlusCircleIcon /> Вакансия
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md ">
        {/* <Card className="w-full">
        <CardHeader>
          <CardTitle>Создание вакансии</CardTitle>
          <CardDescription>
            Заполните поля для создания вакансии
          </CardDescription>
        </CardHeader>
        <CardContent> */}
        <div>
          <h1>Создание вакансии</h1>
          <p>Заполните поля для создания вакансии</p>
        </div>
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
          </div>
        </form>
        {/* </CardContent> */}
        {/* <CardFooter className="flex justify-between"> */}
        <Button id="submitButton" onClick={submitData} disabled={!title}>
          Создать
        </Button>
        {/* </CardFooter> */}
        {/* </Card> */}
      </DialogContent>
    </Dialog>
  );
};

export default ButtonCreate;
