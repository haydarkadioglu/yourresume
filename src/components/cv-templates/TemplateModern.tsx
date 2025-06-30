import type { ResumeData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Link as LinkIcon, Linkedin, Github } from "lucide-react";
import React from "react";

export function TemplateModern({ data }: { data: ResumeData }) {
  // NOTE: This template has a fixed two-column layout. 
  // The reordering logic from the dashboard will not apply to this specific template
  // to preserve its unique design.

  const rightColumnSections = {
    summary: data.personalInfo.summary ? (
      <section id="summary" className="mb-8 print:mb-6">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-primary mb-3 border-b pb-2">Summary</h2>
        <p className="text-foreground/80 mt-4 print:mt-2">{data.personalInfo.summary}</p>
      </section>
    ) : null,
    experience: data.experience?.length > 0 ? (
      <section id="experience" className="mb-8 print:mb-6">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-primary mb-4 border-b pb-2">Experience</h2>
        <div className="space-y-6 print:space-y-4 mt-4 print:mt-2">
          {data.experience.map((job) => (
            <div key={job.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg print:text-base font-semibold">{job.title}</h3>
                 <span className="text-sm print:text-xs text-muted-foreground">{job.startDate} - {job.endDate}</span>
              </div>
               <h4 className="text-md print:text-sm text-muted-foreground">{job.company} - {job.location}</h4>
              <p className="mt-2 print:mt-1 text-foreground/80">{job.description}</p>
            </div>
          ))}
        </div>
      </section>
    ) : null,
    projects: data.projects?.length > 0 ? (
      <section id="projects" className="mb-8 print:mb-6">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-primary mb-4 border-b pb-2">Projects</h2>
         <div className="space-y-4 print:space-y-3 mt-4 print:mt-2">
          {data.projects.map((project) => (
            <div key={project.id}>
              <div className="flex items-center gap-4">
                <h3 className="text-lg print:text-base font-semibold">{project.name}</h3>
                {project.url && <a href={`https://${project.url}`} target="_blank" rel="noopener noreferrer" className="text-sm print:text-xs text-accent hover:underline flex items-center gap-1"><LinkIcon className="h-3 w-3" />View Project</a>}
              </div>
               <div className="flex flex-wrap gap-2 mt-1">
                {project.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs print:text-[10px]">{tag}</Badge>)}
               </div>
              <p className="mt-2 print:mt-1 text-foreground/80">{project.description}</p>
            </div>
          ))}
         </div>
      </section>
    ) : null,
    certifications: data.certifications?.length > 0 ? (
      <section id="certifications">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-primary mb-4 border-b pb-2">Certifications</h2>
         <div className="space-y-2 print:space-y-1 mt-4 print:mt-2">
          {data.certifications.map((cert) => (
            <div key={cert.id}>
              <p className="font-semibold print:font-medium">{cert.name} - <span className="font-normal text-muted-foreground">{cert.issuer}, {cert.date}</span></p>
            </div>
          ))}
         </div>
      </section>
    ) : null,
  };

  const order = ['summary', 'experience', 'projects', 'certifications'];
  const visibleRightSections = order
    .map(key => ({ key, component: rightColumnSections[key as keyof typeof rightColumnSections] }))
    .filter(section => section && section.component);


  return (
    <div id="cv-container" className="printable-area max-w-4xl mx-auto bg-card p-8 sm:p-12 print:p-8 shadow-lg rounded-lg print:shadow-none print:rounded-none">
      <div className="flex flex-col md:flex-row gap-8 print:gap-6">
        {/* Left Column */}
        <aside className="md:w-1/3 space-y-8 print:space-y-6">
          <header className="text-center md:text-left">
            <h1 className="text-4xl print:text-3xl font-bold font-headline text-primary">{data.personalInfo.name}</h1>
            <p className="text-lg print:text-base text-muted-foreground mt-1">{data.personalInfo.title}</p>
          </header>

          <section id="contact">
             <h2 className="text-xl print:text-lg font-bold font-headline text-primary mb-3 border-b pb-2">Contact</h2>
             <div className="space-y-2 print:space-y-1.5 mt-3 text-sm print:text-xs text-muted-foreground">
                {data.personalInfo.email && <a href={`mailto:${data.personalInfo.email}`} className="flex items-center gap-3 hover:text-primary transition-colors"><Mail className="h-4 w-4" /><span>{data.personalInfo.email}</span></a>}
                {data.personalInfo.phone && <a href={`tel:${data.personalInfo.phone}`} className="flex items-center gap-3 hover:text-primary transition-colors"><Phone className="h-4 w-4" /><span>{data.personalInfo.phone}</span></a>}
                {data.personalInfo.website && <a href={`https://${data.personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors"><LinkIcon className="h-4 w-4" /><span>{data.personalInfo.website}</span></a>}
                {data.personalInfo.linkedin && <a href={`https://linkedin.com/in/${data.personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors"><Linkedin className="h-4 w-4" /><span>{data.personalInfo.linkedin}</span></a>}
                {data.personalInfo.github && <a href={`https://github.com/${data.personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors"><Github className="h-4 w-4" /><span>{data.personalInfo.github}</span></a>}
             </div>
          </section>

          {data.skills?.length > 0 && (
            <section id="skills">
              <h2 className="text-xl print:text-lg font-bold font-headline text-primary mb-3 border-b pb-2">Skills</h2>
              <div className="flex flex-wrap gap-2 mt-3">
                {data.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="print:text-xs">{skill}</Badge>
                ))}
              </div>
            </section>
          )}

          {data.education?.length > 0 && (
            <section id="education">
              <h2 className="text-xl print:text-lg font-bold font-headline text-primary mb-3 border-b pb-2">Education</h2>
              <div className="space-y-4 print:space-y-3 mt-3">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="text-md print:text-sm font-semibold">{edu.degree}</h3>
                    <h4 className="text-sm print:text-xs text-muted-foreground">{edu.institution}</h4>
                    <span className="text-xs print:text-[10px] text-muted-foreground">{edu.startDate} - {edu.endDate}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* Right Column */}
        <main className="md:w-2/3 print:text-sm">
           {visibleRightSections.map(({ key, component }) => <React.Fragment key={key}>{component}</React.Fragment>)}
        </main>
      </div>
    </div>
  );
}
