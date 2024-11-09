import { UsersResponse } from "@/api/api_types";

import { pocketbase } from "@/api/pocketbase";
import NextSvg from "@/components/NextButton";
import SignIn from "@/components/sign-in";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Divide } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const users = await pocketbase().collection("users").getList();

  return <SignIn />;
}
import React from "react";
