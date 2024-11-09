"use client";
import { VacancyResponse } from "@/api/api_types";
import VacancyLink from "./VacancyLink";
import clientPocketBase from "@/api/client_pb";
import { useEffect, useState } from "react";

const VacancyCloseList = () => {
  const [vacancies, setVacancies] = useState<Array<VacancyResponse>>([]);

  useEffect(() => {
    const fetchVacancies = async () => {
      const data = await clientPocketBase.collection("vacancy").getFullList();
      const final = data.filter(function (el) {
        if (el.archive == true) {
          return el;
        }
      });
      setVacancies(final);
    };
    fetchVacancies();
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full">
      {vacancies
        .filter((vacancy: VacancyResponse) => vacancy.title)
        .map((vacancy: VacancyResponse) => (
          <VacancyLink key={vacancy.id} id={vacancy.id} name={vacancy.title} />
        ))}
    </div>
  );
};

export default VacancyCloseList;
