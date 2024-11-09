"use client";
import Search from "./InputValue";
import { useSearchParams } from "next/navigation";
import VacancyList from "./VacancyList";
import { Separator } from "./ui/separator";

import ButtonCreate from "./dialogCreate";
const Sidebar: React.FC = () => {
  const searchParams = useSearchParams();
  const inputValue = searchParams.get("inputValue") || "";

  return (
    <div className="flex flex-col min-w-[270px] border-r p-4 space-y-4 h-[92dvh]">
      <Search />
      <VacancyList inputValue={inputValue} />
      <Separator />
      {/* <DialogTrigger asChild>
        <Button className="mt-auto w-full">
          <PlusCircleIcon /> Вакансия
        </Button>
      </DialogTrigger> */}
      <ButtonCreate />
    </div>
  );
};

export default Sidebar;
