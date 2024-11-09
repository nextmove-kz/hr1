"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";

const DashboardPage = ({ params }: { params: { id: string } }) => {
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
    {
      id: 5,
      name: "Senya",
      rating: 9.3,
      experience: "+6 years of experience",
      skills: ["+JavaScript"],
      notes: ["-doesn't use docker"],
      conclusion:
        "very skilled and passionate developer with high rate of match",
    },
  ];

  return (
    <div className="">
      <div className="flex-1 p-6">
        <h1 className="text-xl font-semibold mb-4">
          Resumes ({resumes.length} matches)
        </h1>
        <Accordion type="single" collapsible className="space-y-4">
          {resumes.map((resume) => (
            <AccordionItem key={resume.id} value={`resume-${resume.id}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex justify-between items-center w-full">
                  <span className="text-lg font-medium">{resume.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Rating: {resume.rating}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {resume.experience && (
                    <div className="text-sm">{resume.experience}</div>
                  )}
                  {resume.skills.map((skill, index) => (
                    <div key={index} className="text-sm text-green-600">
                      {skill}
                    </div>
                  ))}
                  {resume.notes.map((note, index) => (
                    <div key={index} className="text-sm text-red-600">
                      {note}
                    </div>
                  ))}
                  {resume.conclusion && (
                    <div className="text-sm text-muted-foreground">
                      Conclusion: {resume.conclusion}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default DashboardPage;
