"use client";
import Search from "./InputValue";
import { useSearchParams } from "next/navigation";
import VacancyList from "./VacancyList";
import { Separator } from "./ui/separator";
import ButtonCreate from "./dialogCreate";
import VacancyCloseList from "./VacancyCloseList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const Sidebar: React.FC = () => {
  const searchParams = useSearchParams();
  const inputValue = searchParams.get("inputValue") || "";

  return (
    <div className="md:flex flex-col max-w-[300px] min-w-[300px] border-r p-4 space-y-4 h-[92dvh] hidden">
      <Search />
      <VacancyList inputValue={inputValue} />
      <Separator />
      {/* <DialogTrigger asChild>
        <Button className="mt-auto w-full">
          <PlusCircleIcon /> Вакансия
        </Button>
      </DialogTrigger> */}
      <ButtonCreate />

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Архивные вакансии</AccordionTrigger>
          <AccordionContent>
            <VacancyCloseList />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Sidebar;
