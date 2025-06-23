import type { ResumeData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Link as LinkIcon } from "lucide-react";
import React from "react";

export function TemplateMinimalist({ data }: { data: ResumeData }) {
  const contactInfo = [
    data.personalInfo.email && <span>{data.personalInfo.email}</span>,
    data.personalInfo.phone && <span>{data.personalInfo.phone}</span>,
    data.personalInfo.website && <a href={`https://${data.personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{data.personalInfo.website}</a>,
    data.personalInfo.linkedin && <a href={`https://${data.personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{data.personalInfo.linkedin}</a>,
    data.personalInfo.github && <a href={`https://${data.personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{data.personalInfo.github}</a>
  ].filter(Boolean);

  return (
    <div id="cv-container" className="printable-area max-w-4xl mx-auto bg-card p-8 sm:p-16 shadow-lg rounded-lg font-sans">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary">{data.personalInfo.name}</h1>
        <p className="text-lg text-muted-foreground mt-2">{data.personalInfo.title}</p>
        <div className="flex justify-center items-center flex-wrap gap-x-2 gap-y-1 mt-4 text-sm text-muted-foreground">
          {contactInfo.map((item, index) => (
            <React.Fragment key={index}>
              {item}
              {index < contactInfo.length - 1 && <span className="px-1">&bull;</span>}
            </React.Fragment>
          ))}
        </div>
      </header>

      <main className="space-y-10">
        {data.personalInfo.summary && (
          <section id="summary">
            <p className="text-center text-lg text-foreground/80">{data.personalInfo.summary}</p>
          </section>
        )}

        {data.skills?.length > 0 && (
            <section id="skills">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="font-normal text-md rounded-sm">{skill}</Badge>
                ))}
                </div>
            </section>
        )}

        {data.experience?.length > 0 && (
          <section id="experience">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Experience</h2>
            <div className="space-y-6">
              {data.experience.map((job) => (
                <div key={job.id} className="grid grid-cols-[1fr_auto] gap-x-4">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <h4 className="text-md text-muted-foreground">{job.company} | {job.location}</h4>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <span>{job.startDate} - {job.endDate}</span>
                  </div>
                  <div className="col-span-2 mt-2">
                    <p className="text-foreground/80">{job.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education?.length > 0 && (
          <section id="education">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="grid grid-cols-[1fr_auto] gap-x-4">
                   <div>
                     <h3 className="text-lg font-semibold">{edu.degree}</h3>
                    <h4 className="text-md text-muted-foreground">{edu.institution} | {edu.location}</h4>
                   </div>
                   <div className="text-right text-sm text-muted-foreground">
                    <span>{edu.startDate} - {edu.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects?.length > 0 && (
          <section id="projects">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Projects</h2>
             <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id}>
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    {project.url && <a href={`https://${project.url}`} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline flex items-center gap-1 mb-2"><LinkIcon className="h-3 w-3" />{project.url}</a>}
                  <p className="mt-1 text-foreground/80">{project.description}</p>
                   <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags.map(tag => <Badge key={tag} variant="outline" className="rounded-sm">{tag}</Badge>)}
                   </div>
                </div>
              ))}
             </div>
          </section>
        )}
      </main>
    </div>
  );
}
