import { getResumeDataByUsername } from "@/lib/firestore";
import { PrintButton } from "@/components/PrintButton";
import { notFound } from "next/navigation";
import type { ResumeData } from "@/types";
import { TemplateClassic } from "@/components/cv-templates/TemplateClassic";
import { TemplateModern } from "@/components/cv-templates/TemplateModern";
import { TemplateMinimalist } from "@/components/cv-templates/TemplateMinimalist";

function Resume({ data }: { data: ResumeData }) {
  const template = data.personalInfo.template || "classic";
  
  switch (template) {
    case 'modern':
      return <TemplateModern data={data} />;
    case 'minimalist':
      return <TemplateMinimalist data={data} />;
    case 'classic':
    default:
      return <TemplateClassic data={data} />;
  }
}


export default async function CVPage({ params }: { params: { username: string } }) {
  const data = await getResumeDataByUsername(params.username);

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="fixed top-4 right-4 z-10 no-print flex gap-2">
         <PrintButton />
      </div>

      <Resume data={data} />
    </div>
  );
}
