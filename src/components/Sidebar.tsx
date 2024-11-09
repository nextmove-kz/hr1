"use client";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Search from "./InputValue";
import { useRouter, useSearchParams } from "next/navigation";
import VacancyLink from "./VacancyLink";
import { PlusCircleIcon } from "@heroicons/react/16/solid";

const Sidebar: React.FC = () => {
  const searchParams = useSearchParams();
  const inputValue = searchParams.get("inputValue") || "";

  // const vacancies = [
  //   { id: "1", name: "Ivan++ dev 1", active: true },
  //   { id: "2", name: "Ivan++ dev 2", active: false },
  //   { id: "3", name: "Ivan++ dev 3", active: false },
  // ];

  return (
    <div className="flex flex-col w-[270px] border-r p-4 space-y-4 h-[92dvh]">
      <Search />
      <div className="flex flex-col gap-2">
        {vacancies
          .filter((vacancy) =>
            vacancy.name.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map((vacancy) => (
            <VacancyLink key={vacancy.id} id={vacancy.id} name={vacancy.name} />
          ))}
      </div>
      <Button className="mt-auto w-full">
        <PlusCircleIcon /> Вакансия
      </Button>
    </div>
  );
};

export default Sidebar;
