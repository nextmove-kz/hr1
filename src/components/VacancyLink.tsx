"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

const VacancyLink = ({ id, name }: { id: string; name: string }) => {
  const path = usePathname();
  const selected = path.includes(id);

  return (
    <Link href={`/dashboard/${id}`}>
      <Button
        variant={selected ? "default" : "outline"}
        className="w-full justify-start truncate"
      >
        {name}
      </Button>
    </Link>
  );
};

export default VacancyLink;
