

"use client";

import { useState, useEffect, useRef } from "react";
import type { ResumeData, Experience, Education, Project, Certification, CustomSection } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Trash2, PlusCircle, Loader2, LayoutTemplate, Palette, Info } from "lucide-react";
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut, updatePassword } from "firebase/auth";
import { getResumeData, saveResumeData } from "@/lib/firestore";
import { mockResumeData } from "@/lib/mock-data";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TemplateClassic } from "@/components/cv-templates/TemplateClassic";
import { TemplateModern } from "@/components/cv-templates/TemplateModern";
import { TemplateMinimalist } from "@/components/cv-templates/TemplateMinimalist";
import { TemplateTwoColumn } from "@/components/cv-templates/TemplateTwoColumn";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const PREDEFINED_COLORS = [
  "262 52% 47%", // Default Purple
  "217 91% 60%", // Blue
  "142 76% 36%", // Green
  "24 98% 52%", // Orange
  "0 84% 60%", // Red
  "330 84% 60%", // Pink
  "240 6% 10%", // Dark Gray
];


export default function DashboardPage() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        let resumeData = await getResumeData(user.uid);
        if (resumeData) {
            resumeData.personalInfo = {
              ...resumeData.personalInfo,
              template: resumeData.personalInfo.template || 'classic',
              themeColor: resumeData.personalInfo.themeColor || PREDEFINED_COLORS[0],
            };
            if (!resumeData.sectionOrder) {
                resumeData.sectionOrder = ['contact', 'skills', 'experience', 'education', 'projects', 'certifications'];
            }
             if (!resumeData.layout) {
              resumeData.layout = {
                sidebar: ['contact', 'skills', 'education', 'certifications'],
                main: ['experience', 'projects'],
              };
            }
            if (!resumeData.customSections) {
                resumeData.customSections = [];
            }
          setData(resumeData);
        } else {
          setData({
              ...mockResumeData,
              personalInfo: {
                  ...mockResumeData.personalInfo,
                  email: user.email || '',
                  username: '',
                  template: 'classic',
                  themeColor: PREDEFINED_COLORS[0],
              },
              sectionOrder: ['contact', 'skills', 'experience', 'education', 'projects', 'certifications'],
              layout: {
                sidebar: ['contact', 'skills', 'education', 'certifications'],
                main: ['experience', 'projects'],
              },
              customSections: [],
          })
        }
      };
      fetchData();
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleSave = async (section: string) => {
    if (!user || !data) return;
    setIsSaving(true);
    
    const result = await saveResumeData(user.uid, data);

    if (result.success) {
      toast({
        title: t('sectionSaved', { section }),
        description: t('sectionSavedDesc'),
      });
    } else {
      toast({
        variant: "destructive",
        title: t('saveError'),
        description: t(result.message as any) || result.message,
      })
    }
    setIsSaving(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: t('passwordsDoNotMatch') });
      return;
    }
    if (!user) return;

    setIsPasswordSaving(true);
    try {
      await updatePassword(user, newPassword);
      toast({ title: t('passwordUpdated') });
      await signOut(auth);
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('passwordUpdateError'),
        description: error.message,
      });
    } finally {
      setIsPasswordSaving(false);
    }
  };


  const handleAddItem = <T extends { id: string }>(
    field: keyof ResumeData,
    newItem: Omit<T, "id">
  ) => {
    setData((prev) => {
        if (!prev) return null;
        return {
           ...prev,
           [field]: [...(prev[field] as T[]), { ...newItem, id: crypto.randomUUID() }],
        }
    });
  };

  const handleRemoveItem = (field: keyof ResumeData, id: string) => {
    setData((prev) => {
       if (!prev) return null;
       return {
        ...prev,
        [field]: (prev[field] as any[]).filter((item) => item.id !== id),
       }
    });
  };
  
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let finalValue = value;
    if (name === 'website') {
      finalValue = value.replace(/^(https?:\/\/)?(www\.)?/i, '').replace(/\/$/, '');
    } else if (name === 'linkedin') {
      finalValue = value.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/(in\/)?/i, '').replace(/\/$/, '');
    } else if (name === 'github') {
      finalValue = value.replace(/^(https?:\/\/)?(www\.)?github\.com\//i, '').replace(/\/$/, '');
    }
    
    setData(prev => {
        if(!prev) return null;
        return {
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [name]: finalValue,
            }
        }
    })
  }

  const handleTemplateChange = (value: 'classic' | 'modern' | 'minimalist' | 'two-column') => {
      setData(prev => {
          if(!prev) return null;
          return {
              ...prev,
              personalInfo: {
                  ...prev.personalInfo,
                  template: value
              }
          }
      })
  }

  const handleColorChange = (value: string) => {
      setData(prev => {
          if(!prev) return null;
          return {
              ...prev,
              personalInfo: {
                  ...prev.personalInfo,
                  themeColor: value
              }
          }
      })
  }
  
  const handleItemChange = <T extends { id: string }>(
    field: keyof ResumeData,
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
      const { name, value } = e.target;
      setData(prev => {
          if (!prev) return null;
          const items = [...(prev[field] as T[])];
          items[index] = { ...items[index], [name]: value };
          return { ...prev, [field]: items };
      })
  }

  const handleCustomSectionChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => {
        if (!prev || !prev.customSections) return prev;
        const items = [...prev.customSections];
        items[index] = { ...items[index], [name]: value };
        return { ...prev, customSections: items };
    });
  };

  const handleAddCustomSection = () => {
    setData(prev => {
        if (!prev) return null;
        const newSection = { id: `custom_${crypto.randomUUID()}`, title: 'New Section', content: '' };
        const newCustomSections = [...(prev.customSections || []), newSection];
        
        // Add to sectionOrder and layout
        const newSectionOrder = [...(prev.sectionOrder || []), newSection.id];
        const newLayout = {
            ...prev.layout,
            main: [...(prev.layout?.main || []), newSection.id]
        };

        return {
            ...prev,
            customSections: newCustomSections,
            sectionOrder: newSectionOrder,
            layout: newLayout
        };
    });
  };

  const handleRemoveCustomSection = (id: string) => {
      setData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            customSections: (prev.customSections || []).filter(item => item.id !== id),
            sectionOrder: (prev.sectionOrder || []).filter(key => key !== id),
            layout: {
                main: (prev.layout?.main || []).filter(key => key !== id),
                sidebar: (prev.layout?.sidebar || []).filter(key => key !== id),
            }
        };
    });
  };

  const handleDoubleClick = () => {
    router.push('/dashboard/layout-editor');
  };


  if (authLoading || !user || !data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const sectionCards: Record<string, React.ReactNode> = {
    personalInfo: (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t('personalInfo')}</CardTitle>
          <CardDescription>{t('personalInfoDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t('username')}</Label>
              <Input id="username" name="username" placeholder="essiz-kullanici-adiniz" value={data.personalInfo.username} onChange={handlePersonalInfoChange} />
              <p className="text-sm text-muted-foreground">{t('usernameDesc', {username: data.personalInfo.username || "..."})}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{t('fullName')}</Label>
              <Input id="name" name="name" value={data.personalInfo.name} onChange={handlePersonalInfoChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">{t('title')}</Label>
              <Input id="title" name="title" value={data.personalInfo.title} onChange={handlePersonalInfoChange} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input id="email" name="email" type="email" value={data.personalInfo.email} onChange={handlePersonalInfoChange} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('phone')}</Label>
              <Input id="phone" name="phone" value={data.personalInfo.phone} onChange={handlePersonalInfoChange} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="website">{t('website')}</Label>
              <Input id="website" name="website" placeholder="your-domain.com" value={data.personalInfo.website} onChange={handlePersonalInfoChange} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="linkedin">{t('linkedin')}</Label>
              <Input id="linkedin" name="linkedin" placeholder="your-username" value={data.personalInfo.linkedin} onChange={handlePersonalInfoChange} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="github">{t('github')}</Label>
              <Input id="github" name="github" placeholder="your-username" value={data.personalInfo.github} onChange={handlePersonalInfoChange} />
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="summary">{t('summary')}</Label>
            <Textarea id="summary" name="summary" value={data.personalInfo.summary} onChange={handlePersonalInfoChange} rows={5} />
          </div>
          <div>
            <Separator className="my-6"/>
             <Label className="text-base font-medium flex items-center gap-2"><Palette /> {t('themeColor')}</Label>
             <p className="text-sm text-muted-foreground mb-2">{t('themeColorDesc')}</p>
             <div className="flex flex-wrap gap-3">
                {PREDEFINED_COLORS.map(colorHsl => (
                  <button
                    key={colorHsl}
                    onClick={() => handleColorChange(colorHsl)}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition-all",
                      data.personalInfo.themeColor === colorHsl ? 'border-ring' : 'border-transparent'
                    )}
                    style={{ backgroundColor: `hsl(${colorHsl})` }}
                  />
                ))}
             </div>
          </div>
          <Button onClick={() => handleSave(t('personalInfo'))} disabled={isSaving} className="bg-accent hover:bg-accent/90">
            {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> {t('saving')}</> : t('saveSection')}
          </Button>
        </CardContent>
      </Card>
    ),
    skills: (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-headline">{t('skills')}</CardTitle>
              <CardDescription>{t('skillsDesc')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="JavaScript, React, Proje Yönetimi, ..."
            value={data.skills.join(', ')}
            onChange={(e) => setData(prev => prev ? ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }) : null)}
            rows={4}
          />
          <Button onClick={() => handleSave(t('skills'))} disabled={isSaving} className="bg-accent hover:bg-accent/90">
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> {t('saving')}</> : t('saveSection')}
          </Button>
        </CardContent>
      </Card>
    ),
    experience: (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
              <div>
                <CardTitle className="font-headline">{t('experience')}</CardTitle>
                <CardDescription>{t('experienceDesc')}</CardDescription>
              </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.experience.map((exp, index) => (
            <div key={exp.id} className="p-4 border rounded-md relative space-y-4">
               <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveItem('experience', exp.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label>{t('title')}</Label>
                      <Input name="title" value={exp.title} onChange={(e) => handleItemChange('experience', index, e)} />
                  </div>
                  <div className="space-y-2">
                      <Label>{t('company')}</Label>
                      <Input name="company" value={exp.company} onChange={(e) => handleItemChange('experience', index, e)} />
                  </div>
                   <div className="space-y-2">
                      <Label>{t('location')}</Label>
                      <Input name="location" value={exp.location} onChange={(e) => handleItemChange('experience', index, e)} />
                  </div>
                   <div className="space-y-2">
                      <Label>{t('startDateEndDate')}</Label>
                      <div className="flex gap-2">
                          <Input name="startDate" value={exp.startDate} onChange={(e) => handleItemChange('experience', index, e)} />
                          <Input name="endDate" value={exp.endDate} onChange={(e) => handleItemChange('experience', index, e)} />
                      </div>
                  </div>
              </div>
              <div className="space-y-2">
                  <Label>{t('description')}</Label>
                  <Textarea name="description" value={exp.description} onChange={(e) => handleItemChange('experience', index, e)} />
              </div>
            </div>
          ))}
           <Button variant="outline" onClick={() => handleAddItem<Experience>('experience', { title: '', company: '', location: '', startDate: '', endDate: '', description: '' })}>
              <PlusCircle className="mr-2 h-4 w-4" /> {t('addExperience')}
          </Button>
          <Separator />
          <Button onClick={() => handleSave(t('experience'))} disabled={isSaving} className="bg-accent hover:bg-accent/90">
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> {t('saving')}</> : t('saveSection')}
          </Button>
        </CardContent>
      </Card>
    ),
    education: (
      <Card>
        <CardHeader>
           <div className="flex justify-between items-center">
              <div>
                <CardTitle className="font-headline">{t('education')}</CardTitle>
                <CardDescription>{t('educationDesc')}</CardDescription>
              </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            {data.education.map((edu, index) => (
                <div key={edu.id} className="p-4 border rounded-md relative space-y-4">
                     <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveItem('education', edu.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                            <Label>{t('degree')}</Label>
                            <Input name="degree" value={edu.degree} onChange={(e) => handleItemChange('education', index, e)} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('institution')}</Label>
                            <Input name="institution" value={edu.institution} onChange={(e) => handleItemChange('education', index, e)} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('location')}</Label>
                            <Input name="location" value={edu.location} onChange={(e) => handleItemChange('education', index, e)} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('startDateEndDate')}</Label>
                            <div className="flex gap-2">
                                <Input name="startDate" value={edu.startDate} onChange={(e) => handleItemChange('education', index, e)} />
                                <Input name="endDate" value={edu.endDate} onChange={(e) => handleItemChange('education', index, e)} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <Button variant="outline" onClick={() => handleAddItem<Education>('education', { degree: '', institution: '', location: '', startDate: '', endDate: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> {t('addEducation')}
            </Button>
            <Separator />
            <Button onClick={() => handleSave(t('education'))} disabled={isSaving} className="bg-accent hover:bg-accent/90">
                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> {t('saving')}</> : t('saveSection')}
            </Button>
        </CardContent>
     </Card>
    ),
    projects: (
      <Card>
          <CardHeader>
              <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="font-headline">{t('projects')}</CardTitle>
                    <CardDescription>{t('projectsDesc')}</CardDescription>
                  </div>
                </div>
          </CardHeader>
          <CardContent className="space-y-6">
              {data.projects.map((proj, index) => (
                  <div key={proj.id} className="p-4 border rounded-md relative space-y-4">
                       <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveItem('projects', proj.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label>{t('projectName')}</Label>
                              <Input name="name" value={proj.name} onChange={(e) => handleItemChange('projects', index, e)} />
                          </div>
                          <div className="space-y-2">
                              <Label>{t('url')}</Label>
                              <Input name="url" value={proj.url} onChange={(e) => handleItemChange('projects', index, e)} />
                          </div>
                      </div>
                      <div className="space-y-2">
                          <Label>{t('description')}</Label>
                          <Textarea name="description" value={proj.description} onChange={(e) => handleItemChange('projects', index, e)} />
                      </div>
                       <div className="space-y-2">
                          <Label>{t('tags')}</Label>
                          <Input 
                              name="tags" 
                              value={proj.tags.join(', ')} 
                              onChange={(e) => {
                                  const newTags = e.target.value.split(',').map(t => t.trim());
                                  const event = { target: { name: 'tags', value: newTags } } as any;
                                  handleItemChange('projects', index, event)
                              }} 
                          />
                      </div>
                  </div>
              ))}
              <Button variant="outline" onClick={() => handleAddItem<Project>('projects', { name: '', description: '', url: '', tags: [] })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> {t('addProject')}
              </Button>
              <Separator />
              <Button onClick={() => handleSave(t('projects'))} disabled={isSaving} className="bg-accent hover:bg-accent/90">
                  {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> {t('saving')}</> : t('saveSection')}
              </Button>
          </CardContent>
      </Card>
    ),
    certifications: (
      <Card>
        <CardHeader>
           <div className="flex justify-between items-center">
              <div>
                <CardTitle className="font-headline">{t('certifications')}</CardTitle>
                <CardDescription>{t('certificationsDesc')}</CardDescription>
              </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            {data.certifications.map((cert, index) => (
                <div key={cert.id} className="p-4 border rounded-md relative space-y-4">
                     <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveItem('certifications', cert.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t('certificationName')}</Label>
                            <Input name="name" value={cert.name} onChange={(e) => handleItemChange('certifications', index, e)} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('issuer')}</Label>
                            <Input name="issuer" value={cert.issuer} onChange={(e) => handleItemChange('certifications', index, e)} />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('date')}</Label>
                            <Input name="date" value={cert.date} onChange={(e) => handleItemChange('certifications', index, e)} />
                        </div>
                    </div>
                </div>
            ))}
            <Button variant="outline" onClick={() => handleAddItem<Certification>('certifications', { name: '', issuer: '', date: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> {t('addCertification')}
            </Button>
            <Separator />
            <Button onClick={() => handleSave(t('certifications'))} disabled={isSaving} className="bg-accent hover:bg-accent/90">
                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> {t('saving')}</> : t('saveSection')}
            </Button>
        </CardContent>
    </Card>
    )
  };

  const customSectionsCard = (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t('customSections')}</CardTitle>
          <CardDescription>{t('customSectionsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {(data.customSections || []).map((section, index) => (
            <div key={section.id} className="p-4 border rounded-md relative space-y-4">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveCustomSection(section.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              <div className="space-y-2">
                <Label>{t('sectionTitle')}</Label>
                <Input name="title" value={section.title} onChange={(e) => handleCustomSectionChange(index, e)} />
              </div>
              <div className="space-y-2">
                <Label>{t('content')}</Label>
                <Textarea name="content" value={section.content} onChange={(e) => handleCustomSectionChange(index, e)} rows={5}/>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={handleAddCustomSection}>
            <PlusCircle className="mr-2 h-4 w-4" /> {t('addCustomSection')}
          </Button>
          <Separator />
          <Button onClick={() => handleSave(t('customSections'))} disabled={isSaving} className="bg-accent hover:bg-accent/90">
            {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> {t('saving')}</> : t('saveSection')}
          </Button>
        </CardContent>
      </Card>
  );


  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold font-headline text-primary">{t('dashboard')}</h1>
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button asChild variant="outline" disabled={!data.personalInfo.username}>
              <Link href={`/cv/${data.personalInfo.username}`} target="_blank">{t('viewMyCV')}</Link>
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              {t('logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-8">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="content">{t('content')}</TabsTrigger>
            <TabsTrigger value="appearance">{t('appearance')}</TabsTrigger>
            <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-8">
            {sectionCards.personalInfo}
            {Object.keys(sectionCards).filter(key => key !== 'personalInfo').map(key => (
              <div key={key}>
                {sectionCards[key]}
              </div>
            ))}
            {customSectionsCard}
          </TabsContent>

          <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">{t('appearanceManager')}</CardTitle>
                  <CardDescription>
                    {t('appearanceManagerDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div ref={editorRef}>
                    <Label className="text-base font-medium">{t('baseTemplate')}</Label>
                    <div className="light">
                      <RadioGroup
                          value={data.personalInfo.template}
                          onValueChange={handleTemplateChange}
                          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2"
                      >
                        <Label
                          htmlFor="classic"
                          className={cn( "rounded-lg border-2 p-1 transition-all cursor-pointer", data.personalInfo.template === 'classic' ? "border-primary" : "border-transparent" )}
                        >
                              <RadioGroupItem value="classic" id="classic" className="sr-only"/>
                              <div className="w-full aspect-[3/4] rounded-md overflow-hidden bg-card border pointer-events-none">
                                  <div className="transform scale-[0.25] origin-top-left" style={{ '--primary-hsl': data.personalInfo.themeColor } as React.CSSProperties}>
                                      <div className="w-[1280px] h-[1810px]">
                                          <TemplateClassic data={data} />
                                      </div>
                                  </div>
                              </div>
                              <p className="text-center font-medium mt-2">{t('classic')}</p>
                        </Label>
                        <Label
                          htmlFor="modern"
                          className={cn( "rounded-lg border-2 p-1 transition-all cursor-pointer", data.personalInfo.template === 'modern' ? "border-primary" : "border-transparent" )}
                        >
                              <RadioGroupItem value="modern" id="modern" className="sr-only"/>
                              <div className="w-full aspect-[3/4] rounded-md overflow-hidden bg-card border pointer-events-none">
                                  <div className="transform scale-[0.25] origin-top-left" style={{ '--primary-hsl': data.personalInfo.themeColor } as React.CSSProperties}>
                                      <div className="w-[1280px] h-[1810px]">
                                          <TemplateModern data={data} />
                                      </div>
                                  </div>
                              </div>
                              <p className="text-center font-medium mt-2">{t('modern')}</p>
                        </Label>
                        <Label
                          htmlFor="minimalist"
                          className={cn( "rounded-lg border-2 p-1 transition-all cursor-pointer", data.personalInfo.template === 'minimalist' ? "border-primary" : "border-transparent" )}
                        >
                              <RadioGroupItem value="minimalist" id="minimalist" className="sr-only"/>
                              <div className="w-full aspect-[3/4] rounded-md overflow-hidden bg-card border pointer-events-none">
                                  <div className="transform scale-[0.25] origin-top-left" style={{ '--primary-hsl': data.personalInfo.themeColor } as React.CSSProperties}>
                                      <div className="w-[1280px] h-[1810px]">
                                          <TemplateMinimalist data={data} />
                                      </div>
                                  </div>
                              </div>
                            <p className="text-center font-medium mt-2">{t('minimalist')}</p>
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Label
                                htmlFor="two-column"
                                className={cn("rounded-lg border-2 p-1 transition-all cursor-pointer relative", data.personalInfo.template === 'two-column' ? "border-primary" : "border-transparent" )}
                                onDoubleClick={handleDoubleClick}
                              >
                                <RadioGroupItem value="two-column" id="two-column" className="sr-only"/>
                                <div className="w-full aspect-[3/4] rounded-md overflow-hidden bg-card border-2 border-dashed flex items-center justify-center">
                                    <PlusCircle className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <p className="text-center font-medium mt-2">{t('createYourOwn')}</p>
                              </Label>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t('doubleClickToEdit')}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </RadioGroup>
                    </div>
                  </div>

                  <Separator />
                  
                  <Button onClick={() => router.push('/dashboard/layout-editor')} variant="outline" className="gap-2">
                     <LayoutTemplate /> {t('customizeOrderAndLayout')}
                  </Button>
                  
                  <Button onClick={() => handleSave(t('appearance'))} disabled={isSaving} className="bg-accent hover:bg-accent/90">
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> {t('saving')}</> : t('saveAppearance')}
                  </Button>
                </CardContent>
              </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">{t('passwordChange')}</CardTitle>
                <CardDescription>{t('passwordChangeDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t('newPassword')}</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('confirmNewPassword')}</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isPasswordSaving} className="bg-accent hover:bg-accent/90">
                    {isPasswordSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> {t('saving')}</> : t('updatePassword')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
