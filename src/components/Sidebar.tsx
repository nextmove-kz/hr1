"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Search from "./InputValue";
import { useRouter, useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

const Sidebar: React.FC = () => {
  const searchParams = useSearchParams();
  const inputValue = searchParams.get("inputValue") || "";
  const [id, setId] = useState<string>("");
  const vacId = searchParams.get("id") || "1";
  const [isOpen, setIsOpen] = useState(true);

  const [selected, setSelected] = useState<number>();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const vacancies = [
    { id: "1", name: "Ivan++ dev 1", active: true },
    { id: "2", name: "Ivan++ dev 2", active: false },
    { id: "3", name: "Ivan++ dev 3", active: false },
  ];

  const handleChange = (index: number) => {
    setSelected(index);
  };
  return (
    <div className="flex flex-col w-64 border-r p-4 space-y-4">
      <Search />
      <div className="space-y-2 w-full">
        <ScrollArea className="h-full">
          {vacancies
            .filter((vacancy) =>
              vacancy.name.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map((vacancy, index) => (
              <div className="w-full flex-start" key={index}>
                <Link
                  href={`/dashboard/${vacancy.id}?inputValue=${inputValue}`}
                >
                  {vacancy.name}
                </Link>
              </div>
            ))}
        </ScrollArea>
      </div>

      <Button className="mt-auto w-full">Add Vacancy</Button>
    </div>
  );
};

export default Sidebar;
