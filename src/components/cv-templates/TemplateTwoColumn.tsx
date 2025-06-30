

import type { ResumeData, CustomSection } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Link as LinkIcon, Linkedin, Github } from "lucide-react";
import React from "react";

const ContactSectionComponent = ({ data, inSidebar }: { data: ResumeData; inSidebar: boolean }) => {
  const header = (
    <div className={inSidebar ? "" : "text-center"}>
      <h1 className={`${inSidebar ? "text-3xl" : "text-4xl sm:text-5xl"} print:text-3xl font-bold font-headline text-primary`}>{data.personalInfo.name}</h1>
      <p className={`${inSidebar ? "text-lg" : "text-xl"} print:text-lg text-muted-foreground mt-1`}>{data.personalInfo.title}</p>
    </div>
  );

  const contactDetails = (
    <div className="space-y-2 print:space-y-1.5 mt-3 text-sm print:text-xs text-muted-foreground break-all">
      {data.personalInfo.email && <a href={`mailto:${data.personalInfo.email}`} className="flex items-center gap-3 hover:text-primary transition-colors"><Mail className="h-4 w-4 flex-shrink-0" /><span>{data.personalInfo.email}</span></a>}
      {data.personalInfo.phone && <a href={`tel:${data.personalInfo.phone}`} className="flex items-center gap-3 hover:text-primary transition-colors"><Phone className="h-4 w-4 flex-shrink-0" /><span>{data.personalInfo.phone}</span></a>}
      {data.personalInfo.website && <a href={`https://${data.personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors"><LinkIcon className="h-4 w-4 flex-shrink-0" /><span>{data.personalInfo.website}</span></a>}
      {data.personalInfo.linkedin && <a href={`https://linkedin.com/in/${data.personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors"><Linkedin className="h-4 w-4 flex-shrink-0" /><span>{data.personalInfo.linkedin}</span></a>}
      {data.personalInfo.github && <a href={`https://github.com/${data.personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors"><Github className="h-4 w-4 flex-shrink-0" /><span>{data.personalInfo.github}</span></a>}
    </div>
  );

  if (inSidebar) {
    return (
      <section id="contact-info">
        {header}
        <Separator className="my-4" />
        <h2 className="text-xl print:text-lg font-bold font-headline text-primary">Contact</h2>
        {contactDetails}
      </section>
    );
  }

  return (
    <header className="border-b border-border pb-6">
      {header}
      <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 mt-4 print:mt-2 text-sm print:text-xs text-muted-foreground">
        {contactDetails.props.children}
      </div>
    </header>
  );
};

const CustomSectionSidebarComponent = ({ section }: { section: CustomSection }) => (
    <section id={section.id}>
        <h2 className="text-xl print:text-lg font-bold font-headline text-primary mb-3 border-b pb-2">{section.title}</h2>
        <p className="text-muted-foreground text-sm print:text-xs whitespace-pre-wrap">{section.content}</p>
    </section>
);

const CustomSectionMainComponent = ({ section }: { section: CustomSection }) => (
    <section id={section.id}>
        <h2 className="text-2xl print:text-xl font-bold font-headline text-primary mb-4 border-b pb-2">{section.title}</h2>
        <p className="mt-4 print:mt-2 text-foreground/80 whitespace-pre-wrap">{section.content}</p>
    </section>
);


export function TemplateTwoColumn({ data }: { data: ResumeData }) {
  const allSectionComponents: Record<string, React.ReactNode> = {
    summary: data.personalInfo.summary ? (
      <section id="summary" className="print:mb-6">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-primary mb-3 border-b pb-2">Summary</h2>
        <p className="text-foreground/80 mt-4 print:mt-2">{data.personalInfo.summary}</p>
      </section>
    ) : null,
    skills: data.skills?.length > 0 ? (
      <section id="skills">
        <h2 className="text-xl print:text-lg font-bold font-headline text-primary mb-3 border-b pb-2">Skills</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {data.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="print:text-xs">{skill}</Badge>
          ))}
        </div>
      </section>
    ) : null,
    experience: data.experience?.length > 0 ? (
      <section id="experience">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-primary mb-4 border-b pb-2">Experience</h2>
        <div className="space-y-6 print:space-y-4 mt-4 print:mt-2">
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
              <p className="mt-2 print:mt-1 text-foreground/80 whitespace-pre-wrap">{job.description}</p>
            </div>
          ))}
        </div>
      </section>
    ) : null,
    education: data.education?.length > 0 ? (
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
    ) : null,
    projects: data.projects?.length > 0 ? (
      <section id="projects">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-primary mb-4 border-b pb-2">Projects</h2>
        <div className="space-y-4 print:space-y-3 mt-4 print:mt-2">
          {data.projects.map((project) => (
            <div key={project.id}>
              <div className="flex items-center gap-4">
                <h3 className="text-lg print:text-base font-semibold">{project.name}</h3>
                {project.url && <a href={`https://${project.url}`} target="_blank" rel="noopener noreferrer" className="text-sm print:text-xs text-accent hover:underline flex items-center gap-1"><LinkIcon className="h-3 w-3" />View Project</a>}
              </div>
              <p className="mt-1 text-foreground/80 whitespace-pre-wrap">{project.description}</p>
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
        <h2 className="text-xl print:text-lg font-bold font-headline text-primary mb-3 border-b pb-2">Certifications</h2>
        <div className="space-y-2 print:space-y-1 mt-4 print:mt-2">
          {data.certifications.map((cert) => (
            <div key={cert.id}>
              <p className="font-semibold print:font-medium">{cert.name} - <span className="font-normal text-muted-foreground">{cert.issuer}, {cert.date}</span></p>
            </div>
          ))}
        </div>
      </section>
    ) : null,
    ...(data.customSections || []).reduce((acc, section) => {
        if (!section.title || !section.content) return acc;
        if(data.layout?.sidebar.includes(section.id)) {
            acc[section.id] = <CustomSectionSidebarComponent section={section} />;
        } else {
            acc[section.id] = <CustomSectionMainComponent section={section} />;
        }
        return acc;
    }, {} as Record<string, React.ReactNode>),
  };
  
  const layout = data.layout || { sidebar: [], main: [] };
  
  // Single Column View (if sidebar is empty)
  if (!layout.sidebar || layout.sidebar.length === 0) {
      const allSections = [ 'contact', ...Object.keys(allSectionComponents).filter(k => k !== 'contact') ];
      const singleColumnOrder = data.sectionOrder?.filter(key => allSections.includes(key)) || allSections;
      
      const visibleSections = singleColumnOrder
        .map(key => ({ key, component: allSectionComponents[key as keyof typeof allSectionComponents] }))
        .filter(section => section.component);
      
    return (
      <div id="cv-container" className="printable-area max-w-4xl mx-auto bg-card p-8 sm:p-12 print:p-8 shadow-lg rounded-lg print:shadow-none print:rounded-none">
        <ContactSectionComponent data={data} inSidebar={false} />

        <main className="print:text-sm mt-8 print:mt-6">
          <div className="space-y-8 print:space-y-6">
            {visibleSections.filter(s => s.key !== 'contact').map(({ key, component }, index, arr) => (
                <React.Fragment key={key}>
                    {component}
                    {index < arr.length - 1 && <Separator className="my-8 print:my-6" />}
                </React.Fragment>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Two Column View (default)
  const contactInSidebar = layout.sidebar.includes('contact');

  const sidebarOrder = data.sectionOrder 
    ? data.sectionOrder.filter(key => layout.sidebar.includes(key) && key !== 'contact')
    : layout.sidebar.filter(key => key !== 'contact');
  
  const mainOrder = data.sectionOrder
    ? data.sectionOrder.filter(key => layout.main.includes(key) && key !== 'summary')
    : layout.main.filter(key => key !== 'summary');

  const sidebarSections = sidebarOrder
    .map(key => ({ key, component: allSectionComponents[key as keyof typeof allSectionComponents] }))
    .filter(section => section.component);
    
  const mainSections = mainOrder
    .map(key => ({ key, component: allSectionComponents[key as keyof typeof allSectionComponents] }))
    .filter(section => section.component);

  const summaryComponent = data.personalInfo.summary ? allSectionComponents.summary : null;

  return (
    <div id="cv-container" className="printable-area max-w-4xl mx-auto bg-card p-8 sm:p-12 print:p-8 shadow-lg rounded-lg print:shadow-none print:rounded-none">
      <div className="flex flex-col md:flex-row gap-8 print:gap-6">
        {/* Left Column (Sidebar) */}
        <aside className="md:w-1/3 print:w-1/3 space-y-8 print:space-y-6">
           {contactInSidebar && <ContactSectionComponent data={data} inSidebar={true} />}
           {sidebarSections.map(({ key, component }) => (
            <React.Fragment key={key}>
              {component}
            </React.Fragment>
          ))}
        </aside>

        {/* Right Column (Main) */}
        <main className="md:w-2/3 print:w-2/3 print:text-sm">
          {!contactInSidebar && <ContactSectionComponent data={data} inSidebar={false} />}
          
          <div className="mt-8 print:mt-6 space-y-8 print:space-y-6">
            {summaryComponent}
            
            {(summaryComponent && mainSections.length > 0) && <Separator className="my-8 print:my-6" />}

            {mainSections.map(({ key, component }, index) => (
                <React.Fragment key={key}>
                    {component}
                    {index < mainSections.length - 1 && <Separator className="my-8 print:my-6" />}
                </React.Fragment>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
