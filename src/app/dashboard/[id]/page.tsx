import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getResume } from "@/api/resume";
import { ResumeResponse } from "@/api/api_types";

const DashboardPage = async ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const resumes = await getResume(id);
  if (!resumes) return;

  return (
    <div className="">
      <div className="flex-1 p-6">
        <h1 className="text-xl font-semibold mb-4">
          Resumes ({resumes.length} matches)
        </h1>
        <Accordion type="single" collapsible className="space-y-4">
          {resumes.map((resume: ResumeResponse) => (
            <AccordionItem key={resume.id} value={`resume-${resume.id}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex justify-between items-center w-full">
                  <span className="text-lg font-medium">
                    {resume?.full_name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Rating: {resume.rating}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {resume.pros && <div className="text-sm">{resume?.pros}</div>}
                  {resume.pros.split(", ").map((pro: string, index: number) => (
                    <div key={index} className="text-sm text-green-600">
                      {pro}
                    </div>
                  ))}
                  {resume.cons.split(", ").map((con: string, index: number) => (
                    <div key={index} className="text-sm text-red-600">
                      {con}
                    </div>
                  ))}
                  {resume.summary && (
                    <div className="text-sm text-muted-foreground">
                      Conclusion: {resume.summary}
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
