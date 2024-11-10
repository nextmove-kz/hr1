"use client";
import { usePathname } from "next/navigation";
import { FileUploader } from "./FileUploader";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { useEffect, useState } from "react";
import clientPocketBase from "@/api/client_pb";
import { VacancyResponse } from "@/api/api_types";
import Image from "next/image";
import ResumeParser from "./ResumeParser";

const ParseHH = () => {
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
        <Image
          className="cursor-pointer"
          src="/hh_logo.png"
          alt="hh logo"
          width={30}
          height={30}
        />
      </DialogTrigger>
      <ResumeParser />
    </Dialog>
  );
};

export default ParseHH;
