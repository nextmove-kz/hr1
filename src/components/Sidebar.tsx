"use client";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Search from "./InputValue";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getVacancies } from "@/api/vacancy";

interface Vacancy {
  id: string;
  title: string;
  description: string;
  city: string;
  experience: string;
  minSalary: number;
  maxSalary: number;
  employment_type: string;
  active: boolean;
}

const Sidebar: React.FC = () => {
  const searchParams = useSearchParams();
  const inputValue = searchParams.get("inputValue") || "";
  const [id, setId] = useState<string>("");
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const vacId = searchParams.get("id") || "1";
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const fetchVacancies = async () => {
      const vacancie = await getVacancies(vacId);
      if (!vacancie) return;
      const formattedVacancies = vacancie.map((vacancy) => ({
        id: vacancy.id,
        title: vacancy.title,
        description: vacancy.description,
        city: vacancy.city,
        experience: vacancy.experience,
        minSalary: vacancy.minSalary,
        maxSalary: vacancy.maxSalary,
        employment_type: vacancy.employment_type,
        active: vacancy.active,
      }));
      setVacancies(formattedVacancies);
    };
    fetchVacancies();
  }, [vacId]);

  // const vacancies = [
  //   { id: "1", name: "Ivan++ dev 1", active: true },
  //   { id: "2", name: "Ivan++ dev 2", active: false },
  //   { id: "3", name: "Ivan++ dev 3", active: false },
  // ];

  return (
    <div className="relative flex flex-col w-64 border-r p-4 space-y-4 h-screen">
      <Search />
      <div className="space-y-2 w-full">
        <ScrollArea className="h-full">
          {vacancies
            .filter((vacancy) =>
              vacancy.title.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map((vacancy, index) => (
              <div className="w-full flex-start" key={index}>
                <Link
                  href={`/dashboard/${vacancy.id}?inputValue=${inputValue}`}
                >
                  {vacancy.title}
                </Link>
              </div>
            ))}
        </ScrollArea>
      </div>

      <Button className="mt-auto w-full">Добавить Вакансию</Button>
    </div>
  );
};

export default Sidebar;
