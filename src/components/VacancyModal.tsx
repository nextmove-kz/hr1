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
import { VacancyResponse } from "@/api/api_types";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import clientPocketBase from "@/api/client_pb";

export default function VacancyModal() {
  const router = useRouter();
  const pathname = usePathname();
  const vacancyParam = pathname.split("/")[2];
  const vacancyId = vacancyParam ? vacancyParam.split("?")[0] : "";
  const [vacancy, setVacancy] = useState<VacancyResponse>();

  useEffect(() => {
    if (vacancyId) {
      clientPocketBase
        .collection("vacancy")
        .getOne(vacancyId)
        .then((data) => {
          setVacancy(data);
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
      full_time: "полный день",
      part_time: "частичный день",
      internship: "интернинспективный",
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
          <DialogTitle className="text-3xl font-bold">
            {vacancy?.title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
            <Building2 className="h-5 w-5 text-green-600" />
            <span>{vacancy?.city}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <span>{experienceConvert(vacancy?.experience as string)}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
            <Clock className="h-5 w-5 text-green-600" />
            <span>{employmentConvert(vacancy?.employment_type as string)}</span>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <p className="font-medium">Freedom Telecom</p>
            <p className="text-sm text-gray-600">{vacancy?.description}</p>
            <p className="text-sm text-gray-600">
              Мы работаем в тесном сотрудничестве с мировыми производителями
              оборудования - программного обеспечения.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
