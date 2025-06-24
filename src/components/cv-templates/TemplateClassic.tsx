import type { ResumeData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Link as LinkIcon, Linkedin, Github } from "lucide-react";
import React from "react";

export function TemplateClassic({ data }: { data: ResumeData }) {
  const sectionComponents = {
    summary: data.personalInfo.summary ? (
      <section id="summary" className="mb-8 print:mb-6">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-primary mb-3">Summary</h2>
        <p className="text-foreground/80">{data.personalInfo.summary}</p>
      </section>
    ) : null,
    skills: data.skills?.length > 0 ? (
      <section id="skills" className="mb-8 print:mb-6">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-primary mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-base print:text-sm font-normal">{skill}</Badge>
          ))}
        </div>
      </section>
    ) : null,
    experience: data.experience?.length > 0 ? (
      <section id="experience">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-primary mb-4">Experience</h2>
        <div className="space-y-6 print:space-y-4">
          {data.experience.map((job) => (
            <div key={job.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg print:text-base font-semibold">{job.title}</h3>
                <span className="text-sm print:text-xs text-muted-foreground">{job.startDate} - {job.endDate}</span>
              </div>
              <div className="flex justify-between items-baseline text-md print:text-sm text-muted-foreground">
                <h4>{job.company}</h4>
                <span>{job.location}</span>
              </div>
              <p className="mt-2 print:mt-1 text-foreground/80">{job.description}</p>
            </div>
          ))}
        </div>
      </section>
    ) : null,
    education: data.education?.length > 0 ? (
      <section id="education">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-primary mb-4">Education</h2>
        <div className="space-y-4 print:space-y-3">
          {data.education.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg print:text-base font-semibold">{edu.degree}</h3>
                <span className="text-sm print:text-xs text-muted-foreground">{edu.startDate} - {edu.endDate}</span>
              </div>
              <div className="flex justify-between items-baseline text-md print:text-sm text-muted-foreground">
                <h4>{edu.institution}</h4>
                <span>{edu.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    ) : null,
    projects: data.projects?.length > 0 ? (
      <section id="projects">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-primary mb-4">Projects</h2>
        <div className="space-y-4 print:space-y-3">
          {data.projects.map((project) => (
            <div key={project.id}>
              <div className="flex items-center gap-4">
                <h3 className="text-lg print:text-base font-semibold">{project.name}</h3>
                {project.url && <a href={`https://${project.url}`} target="_blank" rel="noopener noreferrer" className="text-sm print:text-xs text-accent hover:underline flex items-center gap-1"><LinkIcon className="h-3 w-3" />View Project</a>}
              </div>
              <p className="mt-1 text-foreground/80">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.tags.map(tag => <Badge key={tag} variant="outline" className="print:text-xs">{tag}</Badge>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    ) : null,
    certifications: data.certifications?.length > 0 ? (
      <section id="certifications">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-primary mb-4">Certifications</h2>
        <div className="space-y-2 print:space-y-1">
          {data.certifications.map((cert) => (
            <div key={cert.id}>
              <p className="font-semibold print:font-medium">{cert.name} - <span className="font-normal text-muted-foreground">{cert.issuer}, {cert.date}</span></p>
            </div>
          ))}
        </div>
      </section>
    ) : null,
  };

  const order = data.sectionOrder || ['summary', 'skills', 'experience', 'education', 'projects', 'certifications'];
  // We handle summary separately, so filter it out from the main list.
  const sectionOrder = order.filter(key => key !== 'summary');
  const visibleSections = sectionOrder
    .map(key => ({ key, component: sectionComponents[key as keyof typeof sectionComponents] }))
    .filter(section => section.component);


  return (
    <div id="cv-container" className="printable-area max-w-4xl mx-auto bg-card p-8 sm:p-12 print:p-8 shadow-lg rounded-lg print:shadow-none print:rounded-none">
      <header className="text-center border-b border-border pb-6 mb-6 print:pb-4 print:mb-4">
        <h1 className="text-4xl sm:text-5xl print:text-4xl font-bold font-headline text-primary">{data.personalInfo.name}</h1>
        <p className="text-xl print:text-lg text-muted-foreground mt-2">{data.personalInfo.title}</p>
        <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 mt-4 print:mt-2 text-sm print:text-xs text-muted-foreground">
          {data.personalInfo.email && <a href={`mailto:${data.personalInfo.email}`} className="flex items-center gap-2 hover:text-primary transition-colors"><Mail className="h-4 w-4 print:h-3 print:w-3" />{data.personalInfo.email}</a>}
          {data.personalInfo.phone && <a href={`tel:${data.personalInfo.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors"><Phone className="h-4 w-4 print:h-3 print:w-3" />{data.personalInfo.phone}</a>}
          {data.personalInfo.website && <a href={`https://${data.personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors"><LinkIcon className="h-4 w-4 print:h-3 print:w-3" />{data.personalInfo.website}</a>}
          {data.personalInfo.linkedin && <a href={`https://linkedin.com/${data.personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors"><Linkedin className="h-4 w-4 print:h-3 print:w-3" />{data.personalInfo.linkedin}</a>}
          {data.personalInfo.github && <a href={`https://github.com/${data.personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors"><Github className="h-4 w-4 print:h-3 print:w-3" />{data.personalInfo.github}</a>}
        </div>
      </header>

      <main className="print:text-sm">
        {sectionComponents.summary && (
            <>
                {sectionComponents.summary}
                <Separator className="my-8 print:my-6" />
            </>
        )}
        
        {visibleSections.map(({ key, component }, index) => (
            <React.Fragment key={key}>
                {component}
                {index < visibleSections.length - 1 && <Separator className="my-8 print:my-6" />}
            </React.Fragment>
        ))}

      </main>
    </div>
  );
}
