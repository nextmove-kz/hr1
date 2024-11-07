import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronDoubleRightIcon } from "@heroicons/react/16/solid";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Card className="w-[360px]">
        <CardHeader className="">
          <CardTitle>
            <div>
              Let's crash it{" "}
              <ChevronDoubleRightIcon className="inline-block w-10 h-10" />
            </div>
          </CardTitle>
          <CardDescription>
            Если вы судья который просматривает коммиты. То назовите этот код
            нам чтобы получить шоколадку.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center">
          <p>Код: IPV4 БЫЛ ОШИБКОЙ</p>
          <Image
            src="/lock-in-silly-cat.gif"
            alt="lock in silly cat"
            width={200}
            height={200}
            unoptimized
          />
        </CardContent>
      </Card>
    </div>
  );
}
