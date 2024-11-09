import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const DashboardPage = () => {
  const resumes = [
    {
      id: 1,
      name: "Ivan Ivan",
      rating: 9.3,
      experience: "+6 years of experience",
      skills: ["+JavaScript"],
      notes: ["-doesn't use docker"],
      conclusion:
        "very skilled and passionate developer with high rate of match",
    },
    {
      id: 2,
      name: "Ivan Ivan",
      rating: 9.3,
      experience: "+6 years of experience",
      skills: ["+JavaScript"],
      notes: ["-doesn't use docker"],
      conclusion:
        "very skilled and passionate developer with high rate of match",
    },
    {
      id: 3,
      name: "Ivan Ivan",
      rating: 9.3,
      experience: "+6 years of experience",
      skills: ["+JavaScript"],
      notes: ["-doesn't use docker"],
      conclusion:
        "very skilled and passionate developer with high rate of match",
    },
    {
      id: 4,
      name: "Ivan Ivan",
      rating: 9.3,
      experience: "+6 years of experience",
      skills: ["+JavaScript"],
      notes: ["-doesn't use docker"],
      conclusion:
        "very skilled and passionate developer with high rate of match",
    },
  ];
  return (
    <div>
      <div className="flex h-screen justify-center items-center mt-auto text-3xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="size-10"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
          />
        </svg>
        Choose Vacancy
      </div>
    </div>
  );
};

export default DashboardPage;
