import type { ResumeData, CustomTemplate } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, Globe, Linkedin, Github, MapPin, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateCustomProps {
  data: ResumeData;
}

export function TemplateCustom({ data }: TemplateCustomProps) {
  const customTemplate = data.customTemplate;
  
  if (!customTemplate) {
    // Fallback to classic template if no custom template is defined
    return <div className="p-8">No custom template defined</div>;
  }

  const fontClass = customTemplate.fontFamily === 'serif' ? 'font-serif' : 
                   customTemplate.fontFamily === 'mono' ? 'font-mono' : 'font-sans';
  
  const fontSizeClass = customTemplate.fontSize === 'small' ? 'text-sm' : 
                       customTemplate.fontSize === 'large' ? 'text-lg' : 'text-base';
  
  const spacingClass = customTemplate.spacing === 'compact' ? 'space-y-4' : 
                      customTemplate.spacing === 'relaxed' ? 'space-y-8' : 'space-y-6';
  
  const marginClass = customTemplate.pageMargin === 'tight' ? 'p-4' : 
                     customTemplate.pageMargin === 'wide' ? 'p-12' : 'p-8';
  
  const borderRadiusClass = customTemplate.borderRadius === 'none' ? 'rounded-none' :
                           customTemplate.borderRadius === 'small' ? 'rounded-md' :
                           customTemplate.borderRadius === 'large' ? 'rounded-xl' : 'rounded-lg';

  const headerAlignClass = customTemplate.headerStyle === 'centered' ? 'text-center' : 
                          customTemplate.headerStyle === 'right-aligned' ? 'text-right' : 'text-left';

  const SectionHeader = ({ title }: { title: string }) => {
    if (customTemplate.sectionStyle === 'minimal') {
      return <h2 className="text-xl print:text-lg font-bold mb-4 text-gray-900">{title}</h2>;
    } else if (customTemplate.sectionStyle === 'bordered') {
      return <h2 className="text-xl print:text-lg font-bold mb-4 pb-2 border-b-2 text-gray-900" style={{ borderColor: `hsl(${customTemplate.primaryColor})` }}>{title}</h2>;
    } else {
      return (
        <h2 
          className="text-xl print:text-lg font-bold mb-4 px-3 py-2 rounded text-white"
          style={{ backgroundColor: `hsl(${customTemplate.primaryColor})` }}
        >
          {title}
        </h2>
      );
    }
  };

  const ContactSection = () => (
    <div className="space-y-3">
      {data.personalInfo.phone && (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          {customTemplate.showIcons && <Phone className="h-4 w-4" style={{ color: `hsl(${customTemplate.primaryColor})` }} />}
          <span className={!customTemplate.showIcons ? 'font-medium' : ''}>
            {!customTemplate.showIcons ? 'Phone: ' : ''}{data.personalInfo.phone}
          </span>
        </div>
      )}
      {data.personalInfo.email && (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          {customTemplate.showIcons && <Mail className="h-4 w-4" style={{ color: `hsl(${customTemplate.primaryColor})` }} />}
          <span className={!customTemplate.showIcons ? 'font-medium' : ''}>
            {!customTemplate.showIcons ? 'Email: ' : ''}{data.personalInfo.email}
          </span>
        </div>
      )}
      {data.personalInfo.website && (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          {customTemplate.showIcons && <Globe className="h-4 w-4" style={{ color: `hsl(${customTemplate.primaryColor})` }} />}
          <span className={!customTemplate.showIcons ? 'font-medium' : ''}>
            {!customTemplate.showIcons ? 'Website: ' : ''}{data.personalInfo.website}
          </span>
        </div>
      )}
      {data.personalInfo.linkedin && (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          {customTemplate.showIcons && <Linkedin className="h-4 w-4" style={{ color: `hsl(${customTemplate.primaryColor})` }} />}
          <span className={!customTemplate.showIcons ? 'font-medium' : ''}>
            {!customTemplate.showIcons ? 'LinkedIn: ' : ''}{data.personalInfo.linkedin}
          </span>
        </div>
      )}
      {data.personalInfo.github && (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          {customTemplate.showIcons && <Github className="h-4 w-4" style={{ color: `hsl(${customTemplate.primaryColor})` }} />}
          <span className={!customTemplate.showIcons ? 'font-medium' : ''}>
            {!customTemplate.showIcons ? 'GitHub: ' : ''}{data.personalInfo.github}
          </span>
        </div>
      )}
    </div>
  );

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case 'contact':
        return (
          <section key={sectionKey}>
            <SectionHeader title="Contact Information" />
            <ContactSection />
          </section>
        );
      case 'summary':
        return data.personalInfo.summary ? (
          <section key={sectionKey}>
            <SectionHeader title="Professional Summary" />
            <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
          </section>
        ) : null;
      case 'skills':
        return data.skills?.length > 0 ? (
          <section key={sectionKey}>
            <SectionHeader title="Skills" />
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs"
                  style={{ 
                    backgroundColor: `hsl(${customTemplate.primaryColor} / 0.1)`,
                    color: `hsl(${customTemplate.primaryColor})`,
                    borderColor: `hsl(${customTemplate.primaryColor} / 0.3)`
                  }}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </section>
        ) : null;
      case 'experience':
        return data.experience?.length > 0 ? (
          <section key={sectionKey}>
            <SectionHeader title="Experience" />
            <div className="space-y-6 print:space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="space-y-2 print:break-inside-avoid">
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-lg print:text-base" style={{ color: `hsl(${customTemplate.primaryColor})` }}>{exp.title}</h3>
                    <p className="font-medium text-base print:text-sm text-gray-800">{exp.company}</p>
                    <div className="flex gap-4 text-sm print:text-xs text-gray-600">
                      {exp.location && <span>{exp.location}</span>}
                      <span>{exp.startDate} - {exp.endDate}</span>
                    </div>
                  </div>
                  {exp.description && <p className="text-gray-700 print:text-sm leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case 'education':
        return data.education?.length > 0 ? (
          <section key={sectionKey}>
            <SectionHeader title="Education" />
            <div className="space-y-4 print:space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="space-y-1 print:break-inside-avoid">
                  <h3 className="font-semibold print:text-sm" style={{ color: `hsl(${customTemplate.primaryColor})` }}>{edu.degree}</h3>
                  <p className="font-medium print:text-sm text-gray-800">{edu.institution}</p>
                  <div className="flex gap-4 text-sm print:text-xs text-gray-600">
                    {edu.location && <span>{edu.location}</span>}
                    <span>{edu.startDate} - {edu.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case 'projects':
        return data.projects?.length > 0 ? (
          <section key={sectionKey}>
            <SectionHeader title="Projects" />
            <div className="space-y-4 print:space-y-3">
              {data.projects.map((project) => (
                <div key={project.id} className="space-y-2 print:break-inside-avoid">
                  <div className="flex items-center gap-4">
                    <h3 className="font-semibold print:text-sm" style={{ color: `hsl(${customTemplate.primaryColor})` }}>{project.name}</h3>
                    {project.url && (
                      <a 
                        href={`https://${project.url}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm print:text-xs hover:underline flex items-center gap-1"
                        style={{ color: `hsl(${customTemplate.primaryColor})` }}
                      >
                        <LinkIcon className="h-3 w-3" />View Project
                      </a>
                    )}
                  </div>
                  {project.description && <p className="text-sm print:text-xs text-gray-700">{project.description}</p>}
                  {project.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs print:text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case 'certifications':
        return data.certifications?.length > 0 ? (
          <section key={sectionKey}>
            <SectionHeader title="Certifications" />
            <div className="space-y-3">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold" style={{ color: `hsl(${customTemplate.primaryColor})` }}>{cert.name}</h3>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                  </div>
                  <span className="text-sm text-gray-600">{cert.date}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      default:
        // Handle custom sections
        const customSection = data.customSections?.find(cs => cs.id === sectionKey);
        return customSection ? (
          <section key={sectionKey}>
            <SectionHeader title={customSection.title} />
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {customSection.content}
            </div>
          </section>
        ) : null;
    }
  };

  return (
    <div 
      id="cv-container" 
      className={cn(
        "printable-area max-w-4xl mx-auto bg-white shadow-lg print:shadow-none print:max-w-none print:mx-0 print:p-4",
        borderRadiusClass,
        marginClass,
        fontClass,
        fontSizeClass
      )}
      style={{ 
        '--primary-color': `hsl(${customTemplate.primaryColor})`, 
        '--secondary-color': `hsl(${customTemplate.secondaryColor})` 
      } as React.CSSProperties}
    >
      {/* Header */}
      <header className={cn("mb-8 print:mb-6", headerAlignClass)}>
        <h1 
          className="text-4xl print:text-3xl font-bold mb-2" 
          style={{ color: `hsl(${customTemplate.primaryColor})` }}
        >
          {data.personalInfo.name}
        </h1>
        <p className="text-xl print:text-lg text-gray-600">{data.personalInfo.title}</p>
      </header>

      {/* Content */}
      {customTemplate.layout === 'single' ? (
        <div className={spacingClass}>
          {customTemplate.sectionOrder.map(section => renderSection(section)).filter(Boolean)}
        </div>
      ) : customTemplate.layout === 'two-column' && customTemplate.columnConfig ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 print:grid-cols-[1fr_2fr] print:gap-6">
          {/* Left Column (Sidebar) */}
          <div className={cn("md:col-span-1", spacingClass)}>
            {customTemplate.columnConfig.leftColumn.map(section => renderSection(section)).filter(Boolean)}
          </div>
          
          {/* Right Column (Main) */}
          <div className={cn("md:col-span-2", spacingClass)}>
            {customTemplate.columnConfig.rightColumn.map(section => renderSection(section)).filter(Boolean)}
          </div>
        </div>
      ) : (
        <div className={spacingClass}>
          {data.sectionOrder?.map(section => renderSection(section)).filter(Boolean)}
        </div>
      )}
    </div>
  );
}
