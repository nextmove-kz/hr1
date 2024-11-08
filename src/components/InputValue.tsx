"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Search = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const pathname = usePathname();
  async function inputResult(event: React.FormEvent) {
    event.preventDefault();
    // ТОЛЬКО ТРОГАЕМ КВЕРИ ПАРАМЫ
    router.push(pathname + "?" + createQueryString("inputValue", inputValue));
  }
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

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
