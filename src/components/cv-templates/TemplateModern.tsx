import type { ResumeData } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Link as LinkIcon, Linkedin, Github } from "lucide-react";

export function TemplateModern({ data }: { data: ResumeData }) {
  return (
    <div id="cv-container" className="printable-area max-w-4xl mx-auto bg-card p-8 sm:p-12 shadow-lg rounded-lg">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column */}
        <aside className="md:w-1/3 space-y-8">
          <header className="text-center md:text-left">
            <h1 className="text-4xl font-bold font-headline text-primary">{data.personalInfo.name}</h1>
            <p className="text-lg text-muted-foreground mt-1">{data.personalInfo.title}</p>
          </header>

          <section id="contact">
             <h2 className="text-xl font-bold font-headline text-primary mb-3 border-b pb-2">Contact</h2>
             <div className="space-y-2 mt-3 text-sm text-muted-foreground">
                <a href={`mailto:${data.personalInfo.email}`} className="flex items-center gap-3 hover:text-primary transition-colors"><Mail className="h-4 w-4" /><span>{data.personalInfo.email}</span></a>
                <a href={`tel:${data.personalInfo.phone}`} className="flex items-center gap-3 hover:text-primary transition-colors"><Phone className="h-4 w-4" /><span>{data.personalInfo.phone}</span></a>
                <a href={`https://${data.personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors"><LinkIcon className="h-4 w-4" /><span>{data.personalInfo.website}</span></a>
                <a href={`https://${data.personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors"><Linkedin className="h-4 w-4" /><span>{data.personalInfo.linkedin}</span></a>
                <a href={`https://{data.personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors"><Github className="h-4 w-4" /><span>{data.personalInfo.github}</span></a>
             </div>
          </section>

          {data.skills?.length > 0 && (
            <section id="skills">
              <h2 className="text-xl font-bold font-headline text-primary mb-3 border-b pb-2">Skills</h2>
              <div className="flex flex-wrap gap-2 mt-3">
                {data.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </section>
          )}

          {data.education?.length > 0 && (
            <section id="education">
              <h2 className="text-xl font-bold font-headline text-primary mb-3 border-b pb-2">Education</h2>
              <div className="space-y-4 mt-3">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="text-md font-semibold">{edu.degree}</h3>
                    <h4 className="text-sm text-muted-foreground">{edu.institution}</h4>
                    <span className="text-xs text-muted-foreground">{edu.startDate} - {edu.endDate}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* Right Column */}
        <main className="md:w-2/3">
          {data.personalInfo.summary && (
            <section id="summary" className="mb-8">
              <h2 className="text-2xl font-bold font-headline text-primary mb-3 border-b pb-2">Summary</h2>
              <p className="text-foreground/80 mt-4">{data.personalInfo.summary}</p>
            </section>
          )}
          
          {data.experience?.length > 0 && (
            <section id="experience" className="mb-8">
              <h2 className="text-2xl font-bold font-headline text-primary mb-4 border-b pb-2">Experience</h2>
              <div className="space-y-6 mt-4">
                {data.experience.map((job) => (
                  <div key={job.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                       <span className="text-sm text-muted-foreground">{job.startDate} - {job.endDate}</span>
                    </div>
                     <h4 className="text-md text-muted-foreground">{job.company} - {job.location}</h4>
                    <p className="mt-2 text-foreground/80">{job.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.projects?.length > 0 && (
            <section id="projects" className="mb-8">
              <h2 className="text-2xl font-bold font-headline text-primary mb-4 border-b pb-2">Projects</h2>
               <div className="space-y-4 mt-4">
                {data.projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <a href={`https://${project.url}`} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline flex items-center gap-1"><LinkIcon className="h-3 w-3" />View Project</a>
                    </div>
                     <div className="flex flex-wrap gap-2 mt-1">
                      {project.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                     </div>
                    <p className="mt-2 text-foreground/80">{project.description}</p>
                  </div>
                ))}
               </div>
            </section>
          )}
          
          {data.certifications?.length > 0 && (
            <section id="certifications">
              <h2 className="text-2xl font-bold font-headline text-primary mb-4 border-b pb-2">Certifications</h2>
               <div className="space-y-2 mt-4">
                {data.certifications.map((cert) => (
                  <div key={cert.id}>
                    <p className="font-semibold">{cert.name} - <span className="font-normal text-muted-foreground">{cert.issuer}, {cert.date}</span></p>
                  </div>
                ))}
               </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
