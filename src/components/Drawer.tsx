"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
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

const positions = [
  {
    title: "Фронтенд Разработчик",
    active: true,
  },
  {
    title: "Бэкенд Эликсир Разработчик",
    active: false,
  },
  {
    title: "Дизайнер Figma",
    active: false,
  },
  {
    title: "Разработчик HTML",
    active: false,
  },
  {
    title: "React frontend",
    active: false,
  },
];

export default function DrawerComponent() {
  const searchParams = useSearchParams();
  const inputValue = searchParams.get("inputValue") || "";

  const [open, setOpen] = React.useState(false);

  return (
    <div className="xl:hidden 2xl:hidden lg:hidden">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-auto">
            Вакансии
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-full">
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

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Архивные вакансии</AccordionTrigger>
                <AccordionContent>
                  <VacancyCloseList />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
