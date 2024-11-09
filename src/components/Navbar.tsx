import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 border-b-[1px] border-slate-200">
      <h1 className="text-2xl font-bold">HR1</h1>
      <div className="flex gap-4 items-center">
        <Button variant="outline">Добавить резюме</Button>
        <Link href="#" className="">
          Выход
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
