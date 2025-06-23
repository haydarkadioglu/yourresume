import { getResumeDataByUsername } from "@/lib/firestore";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Link as LinkIcon, Linkedin, Github } from "lucide-react";
import { PrintButton } from "@/components/PrintButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function CVPage({ params }: { params: { username: string } }) {
  const data = await getResumeDataByUsername(params.username);

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4 sm:p-8">
      <div className="fixed top-4 right-4 z-10 no-print flex gap-2">
          <Button asChild variant="secondary">
             <Link href="/dashboard">
                Edit Resume
             </Link>
          </Button>
         <PrintButton />
      </div>

      <div id="cv-container" className="printable-area max-w-4xl mx-auto bg-card p-8 sm:p-12 shadow-lg rounded-lg">
        <header className="text-center border-b border-border pb-6 mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold font-headline text-primary">{data.personalInfo.name}</h1>
          <p className="text-xl text-muted-foreground mt-2">{data.personalInfo.title}</p>
          <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-muted-foreground">
            <a href={`mailto:${data.personalInfo.email}`} className="flex items-center gap-2 hover:text-primary transition-colors"><Mail className="h-4 w-4" />{data.personalInfo.email}</a>
            <a href={`tel:${data.personalInfo.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors"><Phone className="h-4 w-4" />{data.personalInfo.phone}</a>
            <a href={`https://${data.personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors"><LinkIcon className="h-4 w-4" />{data.personalInfo.website}</a>
            <a href={`https://${data.personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors"><Linkedin className="h-4 w-4" />{data.personalInfo.linkedin}</a>
            <a href={`https://{data.personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors"><Github className="h-4 w-4" />{data.personalInfo.github}</a>
          </div>
        </header>

        <main>
          <section id="summary" className="mb-8">
            <h2 className="text-2xl font-bold font-headline text-primary mb-3">Summary</h2>
            <p className="text-foreground/80">{data.personalInfo.summary}</p>
          </section>
          
          <Separator className="my-8" />

          <section id="skills" className="mb-8">
            <h2 className="text-2xl font-bold font-headline text-primary mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-base font-normal">{skill}</Badge>
              ))}
            </div>
          </section>

          <Separator className="my-8" />

          <section id="experience">
            <h2 className="text-2xl font-bold font-headline text-primary mb-4">Experience</h2>
            <div className="space-y-6">
              {data.experience.map((job) => (
                <div key={job.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <span className="text-sm text-muted-foreground">{job.startDate} - {job.endDate}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-md text-muted-foreground">
                    <h4>{job.company}</h4>
                    <span>{job.location}</span>
                  </div>
                  <p className="mt-2 text-foreground/80">{job.description}</p>
                </div>
              ))}
            </div>
          </section>

          <Separator className="my-8" />

          <section id="education">
            <h2 className="text-2xl font-bold font-headline text-primary mb-4">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-lg font-semibold">{edu.degree}</h3>
                    <span className="text-sm text-muted-foreground">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-md text-muted-foreground">
                    <h4>{edu.institution}</h4>
                    <span>{edu.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Separator className="my-8" />

          <section id="projects">
            <h2 className="text-2xl font-bold font-headline text-primary mb-4">Projects</h2>
             <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <a href={`https://${project.url}`} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline flex items-center gap-1"><LinkIcon className="h-3 w-3" />View Project</a>
                  </div>
                  <p className="mt-1 text-foreground/80">{project.description}</p>
                   <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                   </div>
                </div>
              ))}
             </div>
          </section>
          
           <Separator className="my-8" />

          <section id="certifications">
            <h2 className="text-2xl font-bold font-headline text-primary mb-4">Certifications</h2>
             <div className="space-y-2">
              {data.certifications.map((cert) => (
                <div key={cert.id}>
                  <p className="font-semibold">{cert.name} - <span className="font-normal text-muted-foreground">{cert.issuer}, {cert.date}</span></p>
                </div>
              ))}
             </div>
          </section>

        </main>
      </div>
    </div>
  );
}
