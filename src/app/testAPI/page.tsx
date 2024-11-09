"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Anthropic from "@anthropic-ai/sdk";
import { viewVacancy } from "@/api/vacancy";
import { getAnthropicKey, zapros } from "@/api/ai/anthropic";

const page = () => {
  const [allVacancy, setAllVacancy] = useState("");

  useEffect(() => {
    const data = viewVacancy();
    setAllVacancy(JSON.stringify(data));
    console.log(allVacancy);
  }, []);

  const [inputValue, setInputValue] = useState("");

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex w-full max-w-sm space-x-2">
        <Input
          type="text"
          value={inputValue}
          placeholder="text"
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        />
        <Button
          onClick={() => {
            // zapros(inputValue);
          }}
        >
          GO
        </Button>
      </div>
    </div>
  );
};

export default page;
