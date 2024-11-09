"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const Search = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const initialValue = searchParams.get("inputValue") || "";
    setInputValue(initialValue);
  }, [searchParams]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    const params = new URLSearchParams(searchParams.toString());

    if (newValue) {
      params.set("inputValue", newValue);
    } else {
      params.delete("inputValue");
    }

    const newUrl = `${pathname}?${params.toString()}`;

    router.push(newUrl);
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center flex-col gap-7">
        <Input
          type="search"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Поиск"
          className="bg-slate-100 border-none"
        />
      </div>
    </div>
  );
};

export default Search;
