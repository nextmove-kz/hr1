"use client";
import { VacancyResponse } from "@/api/api_types";
import React from "react";
import VacancyLink from "./VacancyLink";
import clientPocketBase from "@/api/client_pb";

const VacancyList = ({ inputValue }: { inputValue: string }) => {
  const [vacancies, setVacancies] = React.useState<Array<VacancyResponse>>([]);

  React.useEffect(() => {
    const fetchVacancies = async () => {
      const data = await clientPocketBase.collection("vacancy").getFullList();
      setVacancies(data);
    };
    fetchVacancies();
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full">
      {vacancies
        .filter((vacancy: VacancyResponse) =>
          vacancy.title.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((vacancy: VacancyResponse) => (
          <VacancyLink key={vacancy.id} id={vacancy.id} name={vacancy.title} />
        ))}
    </div>
  );
};

export default VacancyList;
