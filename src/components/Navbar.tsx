import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { FileUploader } from "./FileUploader";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 border-b-[1px] border-slate-200">
      <h1 className="text-2xl font-bold">HR1</h1>
      <div className="flex gap-4 items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Добавить резюме</Button>
          </DialogTrigger>
          <FileUploader />
        </Dialog>
        <Link href="#" className="">
          Выход
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
