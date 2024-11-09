"use client";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Search from "./InputValue";
import { useRouter, useSearchParams } from "next/navigation";
import VacancyLink from "./VacancyLink";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import VacancyList from "./VacancyList";
import { Separator } from "./ui/separator";

const Sidebar: React.FC = () => {
  const searchParams = useSearchParams();
  const inputValue = searchParams.get("inputValue") || "";

  return (
    <div className="flex flex-col min-w-[270px] border-r p-4 space-y-4 h-[92dvh]">
      <Search />
      <VacancyList inputValue={inputValue} />
      <Separator />
      <Button className="mt-auto w-full">
        <PlusCircleIcon /> Вакансия
      </Button>
    </div>
  );
};

export default Sidebar;
