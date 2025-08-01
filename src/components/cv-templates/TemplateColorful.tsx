import type { ResumeData, CustomSection } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Link as LinkIcon, Linkedin, Github } from "lucide-react";
import React from "react";

const CustomSectionComponent = ({ section }: { section: CustomSection }) => (
    <section id={section.id} className="bg-gradient-to-r from-teal-50/30 to-cyan-50/30 p-4 rounded-lg border-l-4 border-teal-400 print:bg-transparent print:border-l-2 print:border-gray-400">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-gray-800 mb-3 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-teal-500 to-cyan-600 rounded-full print:hidden"></div>
          {section.title}
        </h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap print:text-gray-800">{section.content}</p>
    </section>
);

export function TemplateColorful({ data }: { data: ResumeData }) {
  const sectionComponents: Record<string, React.ReactNode> = {
    summary: data.personalInfo.summary ? (
      <section id="summary" className="mb-8 print:mb-6 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 p-4 rounded-lg border-l-4 border-blue-400 print:bg-transparent print:border-l-2 print:border-gray-400">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-gray-800 mb-3 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full print:hidden"></div>
          Summary
        </h2>
        <p className="text-gray-700 leading-relaxed print:text-gray-800">{data.personalInfo.summary}</p>
      </section>
    ) : null,
    skills: data.skills?.length > 0 ? (
      <section id="skills" className="mb-8 print:mb-6 bg-gradient-to-r from-green-50/30 to-emerald-50/30 p-4 rounded-lg border-l-4 border-green-400 print:bg-transparent print:border-l-2 print:border-gray-400">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full print:hidden"></div>
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-base print:text-sm font-normal bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 print:bg-gray-100 print:text-gray-800 print:border-gray-300">{skill}</Badge>
          ))}
        </div>
      </section>
    ) : null,
    experience: data.experience?.length > 0 ? (
      <section id="experience" className="bg-gradient-to-r from-purple-50/30 to-pink-50/30 p-4 rounded-lg border-l-4 border-purple-400 print:bg-transparent print:border-l-2 print:border-gray-400">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full print:hidden"></div>
          Experience
        </h2>
        <div className="space-y-6 print:space-y-4">
          {data.experience.map((job) => (
            <div key={job.id} className="bg-white/60 p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 print:bg-transparent print:border-0 print:shadow-none print:p-0">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg print:text-base font-semibold text-gray-800">{job.title}</h3>
                <span className="text-sm print:text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full print:bg-transparent print:px-0 print:py-0">{job.startDate} - {job.endDate}</span>
              </div>
              <div className="flex justify-between items-baseline text-md print:text-sm text-gray-600 mt-1">
                <h4 className="font-medium">{job.company}</h4>
                <span className="italic">{job.location}</span>
              </div>
              <p className="mt-2 print:mt-1 text-gray-700 leading-relaxed whitespace-pre-wrap print:text-gray-800">{job.description}</p>
            </div>
          ))}
        </div>
      </section>
    ) : null,
    education: data.education?.length > 0 ? (
      <section id="education" className="bg-gradient-to-r from-amber-50/30 to-orange-50/30 p-4 rounded-lg border-l-4 border-amber-400 print:bg-transparent print:border-l-2 print:border-gray-400">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full print:hidden"></div>
          Education
        </h2>
        <div className="space-y-4 print:space-y-3">
          {data.education.map((edu) => (
            <div key={edu.id} className="bg-white/60 p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 print:bg-transparent print:border-0 print:shadow-none print:p-0">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg print:text-base font-semibold text-gray-800">{edu.degree}</h3>
                <span className="text-sm print:text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full print:bg-transparent print:px-0 print:py-0">{edu.startDate} - {edu.endDate}</span>
              </div>
              <div className="flex justify-between items-baseline text-md print:text-sm text-gray-600 mt-1">
                <h4 className="font-medium">{edu.institution}</h4>
                <span className="italic">{edu.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    ) : null,
    projects: data.projects?.length > 0 ? (
      <section id="projects" className="bg-gradient-to-r from-rose-50/30 to-pink-50/30 p-4 rounded-lg border-l-4 border-rose-400 print:bg-transparent print:border-l-2 print:border-gray-400">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-rose-500 to-pink-600 rounded-full print:hidden"></div>
          Projects
        </h2>
        <div className="space-y-4 print:space-y-3">
          {data.projects.map((project) => (
            <div key={project.id} className="bg-white/60 p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 print:bg-transparent print:border-0 print:shadow-none print:p-0">
              <div className="flex items-center gap-4">
                <h3 className="text-lg print:text-base font-semibold text-gray-800">{project.name}</h3>
                {project.url && <a href={`https://${project.url}`} target="_blank" rel="noopener noreferrer" className="text-sm print:text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 transition-colors duration-200"><LinkIcon className="h-3 w-3" />View Project</a>}
              </div>
              <p className="mt-1 text-gray-700 leading-relaxed whitespace-pre-wrap print:text-gray-800">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.tags.map(tag => <Badge key={tag} variant="outline" className="print:text-xs bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-300 hover:from-gray-100 hover:to-gray-200 transition-all duration-200">{tag}</Badge>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    ) : null,
    certifications: data.certifications?.length > 0 ? (
      <section id="certifications" className="bg-gradient-to-r from-violet-50/30 to-purple-50/30 p-4 rounded-lg border-l-4 border-violet-400 print:bg-transparent print:border-l-2 print:border-gray-400">
        <h2 className="text-2xl print:text-xl font-bold font-headline text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-violet-500 to-purple-600 rounded-full print:hidden"></div>
          Certifications
        </h2>
        <div className="space-y-2 print:space-y-1">
          {data.certifications.map((cert) => (
            <div key={cert.id} className="bg-white/60 p-3 rounded-lg border border-gray-100 shadow-sm print:bg-transparent print:border-0 print:shadow-none print:p-0">
              <p className="font-semibold print:font-medium text-gray-800">{cert.name} - <span className="font-normal text-gray-600">{cert.issuer}, {cert.date}</span></p>
            </div>
          ))}
        </div>
      </section>
    ) : null,
    ...(data.customSections || []).reduce((acc, section) => {
        acc[section.id] = <CustomSectionComponent section={section} />;
        return acc;
    }, {} as Record<string, React.ReactNode>),
  };

  const order = data.sectionOrder || ['summary', 'skills', 'experience', 'education', 'projects', 'certifications'];
  const sectionOrder = order.filter(key => key !== 'summary');
  const visibleSections = sectionOrder
    .map(key => ({ key, component: sectionComponents[key as keyof typeof sectionComponents] }))
    .filter(section => section.component);

  return (
    <div id="cv-container" className="printable-area max-w-4xl mx-auto bg-white/90 backdrop-blur-sm border border-gray-200/50 p-8 sm:p-12 print:p-8 shadow-2xl rounded-xl print:shadow-none print:rounded-none print:bg-white print:border-0">
      <header className="text-left border-b border-gray-200/80 pb-6 mb-6 print:pb-4 print:mb-4 bg-gradient-to-r from-gray-50/50 to-white/50 -mx-4 px-4 py-4 rounded-lg print:bg-transparent print:mx-0 print:px-0 print:py-0 print:rounded-none">
        <h1 className="text-4xl sm:text-5xl print:text-4xl font-bold font-headline text-gray-800 drop-shadow-sm">{data.personalInfo.name}</h1>
        <p className="text-xl print:text-lg text-gray-600 mt-2 font-medium">{data.personalInfo.title}</p>
        <div className="space-y-2 mt-4 print:mt-2 text-sm print:text-xs text-gray-600">
          {data.personalInfo.email && <a href={`mailto:${data.personalInfo.email}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-200 hover:scale-105 transform"><Mail className="h-4 w-4 print:h-3 print:w-3 text-blue-500" />{data.personalInfo.email}</a>}
          {data.personalInfo.phone && <a href={`tel:${data.personalInfo.phone}`} className="flex items-center gap-2 hover:text-green-600 transition-colors duration-200 hover:scale-105 transform"><Phone className="h-4 w-4 print:h-3 print:w-3 text-green-500" />{data.personalInfo.phone}</a>}
          {data.personalInfo.website && <a href={`https://${data.personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-purple-600 transition-colors duration-200 hover:scale-105 transform"><LinkIcon className="h-4 w-4 print:h-3 print:w-3 text-purple-500" />{data.personalInfo.website}</a>}
          {data.personalInfo.linkedin && <a href={`https://linkedin.com/in/${data.personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-700 transition-colors duration-200 hover:scale-105 transform"><Linkedin className="h-4 w-4 print:h-3 print:w-3 text-blue-600" />{data.personalInfo.linkedin}</a>}
          {data.personalInfo.github && <a href={`https://github.com/${data.personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gray-800 transition-colors duration-200 hover:scale-105 transform"><Github className="h-4 w-4 print:h-3 print:w-3 text-gray-700" />{data.personalInfo.github}</a>}
        </div>
      </header>

      <main className="print:text-sm space-y-6">
        {sectionComponents.summary && (
            <>
                {sectionComponents.summary}
            </>
        )}
        
        {visibleSections.map(({ key, component }, index) => (
            <React.Fragment key={key}>
                {component}
            </React.Fragment>
        ))}
      </main>
    </div>
  );
}
