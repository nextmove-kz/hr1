"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

const Search = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  async function inputResult(event: React.FormEvent) {
    event.preventDefault();
    router.push(`/dashboard/search/${id}?inputValue=${inputValue}`);
  }

  return (
    <div className="w-full">
      <form
        className="w-full flex justify-between items-center flex-col gap-7"
        onSubmit={inputResult}
      >
        <Input
          type="search"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Вакансия..."
          className="bg-slate-100 border-none"
        />
      </form>
    </div>
  );
};

export default Search;
