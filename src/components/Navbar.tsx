import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { getUser, isLoggedIn, logOut } from "@/api/auth/sign-in";
import SignIn from "./sign-in";
import { LogOutButton } from "./logOutButton";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { FileUploader } from "./FileUploader";
import DrawerComponent from "./Drawer";

export default async function Navbar() {
  const user = await getUser();
  const auth = await isLoggedIn();
  console.log("auth" + auth);

  return (
    <nav className="flex justify-between items-center p-4 border-b-[1px] border-slate-200">
      <div className="flex gap-4">
        <h1 className="text-3xl font-bold font-mono">HR1</h1>
        <DrawerComponent />
      </div>
      <div className="flex gap-4 items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Добавить резюме</Button>
          </DialogTrigger>
          <FileUploader />
        </Dialog>
        {user && auth && <LogOutButton />}
      </div>
    </nav>
  );
}
