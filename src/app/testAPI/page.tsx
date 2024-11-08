"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Anthropic from "@anthropic-ai/sdk";
const page = () => {
  const [inputValue, setInputValue] = useState("");
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_KEY,
    dangerouslyAllowBrowser: true,
  });
  async function zapros(text: string) {
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: text }],
    });
    console.log(msg);
  }
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
            zapros(inputValue);
          }}
        >
          GO
        </Button>
      </div>
    </div>
  );
};

export default page;
