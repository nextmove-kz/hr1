"use client";
import { usePathname } from "next/navigation";
import { FileUploader } from "./FileUploader";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { useEffect, useState } from "react";
import clientPocketBase from "@/api/client_pb";
import { VacancyResponse } from "@/api/api_types";

const AddResume = () => {
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

  if (!vacancy || vacancy.archive) return;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Добавить резюме</Button>
      </DialogTrigger>
      <FileUploader />
    </Dialog>
  );
};

export default AddResume;
