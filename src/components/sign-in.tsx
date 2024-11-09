"use client";
import { signIn } from "@/api/auth/sign-in";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center ">
      <Card className="w-full max-w-md p-6">
        <form
          className="flex flex-col gap-6"
          onSubmit={async (e) => {
            e.preventDefault();
            const response = await signIn(email, password);
            if (response == null) {
              toast({
                title: "Ошибка!",
                description: "Данного пользователя не существует",
              });
            } else {
              router.push("/dashboard/1");
            }
          }}
        >
          <h1 className="text-xl font-semibold text-center">Вход</h1>
          <div className="flex flex-col gap-4">
            <Input
              name="email"
              placeholder="example@mail.com"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <Input
              name="password"
              placeholder="Password"
              type="password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>
          <Button type="submit">Sign in</Button>
        </form>
      </Card>
    </div>
  );
};

export default SignIn;
