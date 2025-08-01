
"use client";

import { getResumeDataByUsername } from "@/lib/firestore";
import { PrintButton } from "@/components/PrintButton";
import { notFound } from "next/navigation";
import type { ResumeData } from "@/types";
import { TemplateClassic } from "@/components/cv-templates/TemplateClassic";
import { TemplateModern } from "@/components/cv-templates/TemplateModern";
import { TemplateMinimalist } from "@/components/cv-templates/TemplateMinimalist";
import { TemplateTwoColumn } from "@/components/cv-templates/TemplateTwoColumn";
import { useEffect, useState, use } from "react";
import { Loader2 } from "lucide-react";

function Resume({ data }: { data: ResumeData }) {
  const template = data.personalInfo.template || "classic";
  const themeColor = data.personalInfo.themeColor;

  const style = themeColor ? { '--primary-hsl': themeColor } as React.CSSProperties : {};

  return (
    <div style={style}>
      {
        {
          'classic': <TemplateClassic data={data} />,
          'modern': <TemplateModern data={data} />,
          'minimalist': <TemplateMinimalist data={data} />,
          'two-column': <TemplateTwoColumn data={data} />
        }[template] || <TemplateClassic data={data} />
      }
    </div>
  )
}

export default function CVPage({ params }: { params: Promise<{ username: string }> }) {
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { username } = use(params);

  useEffect(() => {
    async function fetchData() {
      if (!username) {
        setLoading(false);
        setError(true);
        return;
      }
      setLoading(true);
      try {
        const resumeData = await getResumeDataByUsername(username);
        if (!resumeData) {
          setError(true);
        } else {
          setData(resumeData);
        }
      } catch (err) {
        console.error("Failed to fetch resume data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [username]);

  useEffect(() => {
    if (data?.personalInfo?.name) {
      document.title = `${data.personalInfo.name} | CV`;
    }
  }, [data]);

  if (loading) {
     return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 light">
      <div className="fixed top-4 right-4 z-10 no-print flex gap-2">
         <PrintButton username={data.personalInfo.username || 'resume'} />
      </div>
      <Resume data={data} />
    </div>
  );
}
