"use client";

import { setMark } from "@/api/resume";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "./ui/button";
import { useAtom } from "jotai";
import { inviteAtom } from "@/lib/atoms";
import { ResumeResponse } from "@/api/api_types";
import { Input } from "./ui/input";

type MarkInputProps = {
  resume: ResumeResponse;
};

const MarkInput = ({ resume }: MarkInputProps) => {
  const [rating, setRating] = useState<number>(resume.setMark);
  const [reloadResumes, setReloadResumes] = useAtom(inviteAtom);

  //   const debouncedSetMark = useDebouncedCallback(async (newRating) => {
  //     const results = await setMark(id, newRating);
  //     console.log(results);
  //   }, 300);

  //   useEffect(() => {
  //     debouncedSetMark(rating);
  //   }, [rating, debouncedSetMark]);

  const submitMark = async (e: React.FormEvent) => {
    e.preventDefault();
    const results = await setMark(resume.id, rating);
    console.log(results);
    setReloadResumes((prev) => !prev);
  };

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        submitMark(event);
      }}
    >
      <div className="flex gap-2 items">
        <h2 className="text-lg self-center">Ваша оценка: </h2>
        <Input
          name="rating"
          value={rating}
          className="border border-gray-300 w-24"
          onChange={(event) => {
            const value = +event.target.value;
            if (isNaN(value)) return;
            if (value < 0) return;
            if (value >= 100) return;
            setRating(value);
          }}
        />
        <Button type="submit">Отправить</Button>
      </div>
    </form>
  );
};

export default MarkInput;
