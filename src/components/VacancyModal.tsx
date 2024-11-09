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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Посмотреть вакансию</Button>
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
            <span>{vacancy?.experience}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
            <Clock className="h-5 w-5 text-green-600" />
            <span>{vacancy?.employment_type}</span>
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
