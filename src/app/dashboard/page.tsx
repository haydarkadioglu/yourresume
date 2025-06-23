"use client";

import { useState, useEffect } from "react";
import type { ResumeData, Experience, Education, Project, Certification } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Trash2, PlusCircle, Loader2 } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { getResumeData, saveResumeData } from "@/lib/firestore";
import { mockResumeData } from "@/lib/mock-data";
import { ThemeToggle } from "@/components/ThemeToggle";

const TABS = ["personal", "skills", "experience", "education", "projects", "certifications"];

export default function DashboardPage() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

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
            // Ensure template exists, default if not
            if (!resumeData.personalInfo.template) {
                resumeData.personalInfo.template = 'classic';
            }
          setData(resumeData);
        } else {
          setData({
              ...mockResumeData, // Start with mock data for new users
              personalInfo: {
                  ...mockResumeData.personalInfo,
                  email: user.email || '',
                  username: '',
                  template: 'classic',
              }
          })
        }
      };
      fetchData();
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    toast({ title: "Logged out successfully" });
    router.push('/login');
  };

  const handleSave = async (section: string) => {
    if (!user || !data) return;
    setIsSaving(true);
    
    const result = await saveResumeData(user.uid, data);

    if (result.success) {
      toast({
        title: `${section} Saved`,
        description: `Your ${section.toLowerCase()} information has been updated.`,
      });
      const currentIndex = TABS.indexOf(activeTab);
      if (currentIndex < TABS.length - 1) {
        setActiveTab(TABS[currentIndex + 1]);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error saving",
        description: result.message,
      })
    }
    setIsSaving(false);
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
    setData(prev => {
        if(!prev) return null;
        return {
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [name]: value,
            }
        }
    })
  }

  const handleTemplateChange = (value: 'classic' | 'modern' | 'minimalist') => {
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

  if (authLoading || !user || !data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <header className="bg-card border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold font-headline text-primary">Dashboard</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="outline" disabled={!data.personalInfo.username}>
              <Link href={`/cv/${data.personalInfo.username}`} target="_blank">View My CV</Link>
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-6">
            {TABS.map(tab => <TabsTrigger key={tab} value={tab}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</TabsTrigger>)}
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Personal Information</CardTitle>
                <CardDescription>This information will appear at the top of your resume.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Template Selection */}
                <div className="space-y-3">
                    <Label>Template</Label>
                    <RadioGroup
                        value={data.personalInfo.template}
                        onValueChange={handleTemplateChange}
                        className="grid grid-cols-2 md:grid-cols-3 gap-4"
                    >
                       <Label htmlFor="classic" className="border-2 border-transparent has-[:checked]:border-primary rounded-lg p-1 transition-all">
                           <RadioGroupItem value="classic" id="classic" className="sr-only"/>
                           <Image src="https://placehold.co/300x400.png" alt="Classic Template" width={300} height={400} className="rounded-md w-full aspect-[3/4] object-cover" data-ai-hint="resume classic" />
                           <p className="text-center font-medium mt-2">Classic</p>
                       </Label>
                       <Label htmlFor="modern" className="border-2 border-transparent has-[:checked]:border-primary rounded-lg p-1 transition-all">
                           <RadioGroupItem value="modern" id="modern" className="sr-only"/>
                           <Image src="https://placehold.co/300x400.png" alt="Modern Template" width={300} height={400} className="rounded-md w-full aspect-[3/4] object-cover" data-ai-hint="resume modern" />
                           <p className="text-center font-medium mt-2">Modern</p>
                       </Label>
                       <Label htmlFor="minimalist" className="border-2 border-transparent has-[:checked]:border-primary rounded-lg p-1 transition-all">
                           <RadioGroupItem value="minimalist" id="minimalist" className="sr-only"/>
                           <Image src="https://placehold.co/300x400.png" alt="Minimalist Template" width={300} height={400} className="rounded-md w-full aspect-[3/4] object-cover" data-ai-hint="resume minimalist" />
                           <p className="text-center font-medium mt-2">Minimalist</p>
                       </Label>
                    </RadioGroup>
                </div>

                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" placeholder="your-unique-username" value={data.personalInfo.username} onChange={handlePersonalInfoChange} />
                    <p className="text-sm text-muted-foreground">URL: /cv/{data.personalInfo.username || "..."}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={data.personalInfo.name} onChange={handlePersonalInfoChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input id="title" name="title" value={data.personalInfo.title} onChange={handlePersonalInfoChange} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={data.personalInfo.email} onChange={handlePersonalInfoChange} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={data.personalInfo.phone} onChange={handlePersonalInfoChange} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" name="website" value={data.personalInfo.website} onChange={handlePersonalInfoChange} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input id="linkedin" name="linkedin" value={data.personalInfo.linkedin} onChange={handlePersonalInfoChange} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input id="github" name="github" value={data.personalInfo.github} onChange={handlePersonalInfoChange} />
                  </div>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea id="summary" name="summary" value={data.personalInfo.summary} onChange={handlePersonalInfoChange} rows={5} />
                </div>
                <Button onClick={() => handleSave("Personal Info")} disabled={isSaving} className="bg-accent hover:bg-accent/90">
                  {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : 'Save & Next'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Skills</CardTitle>
                <CardDescription>List your technical and professional skills. Enter skills separated by commas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="JavaScript, React, Project Management, ..."
                  value={data.skills.join(', ')}
                  onChange={(e) => setData(prev => prev ? ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }) : null)}
                  rows={4}
                />
                <Button onClick={() => handleSave("Skills")} disabled={isSaving} className="bg-accent hover:bg-accent/90">
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : 'Save & Next'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Work Experience</CardTitle>
                <CardDescription>Detail your professional history.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={exp.id} className="p-4 border rounded-md relative space-y-4">
                     <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveItem('experience', exp.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Job Title</Label>
                            <Input name="title" value={exp.title} onChange={(e) => handleItemChange('experience', index, e)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Company</Label>
                            <Input name="company" value={exp.company} onChange={(e) => handleItemChange('experience', index, e)} />
                        </div>
                         <div className="space-y-2">
                            <Label>Location</Label>
                            <Input name="location" value={exp.location} onChange={(e) => handleItemChange('experience', index, e)} />
                        </div>
                         <div className="space-y-2">
                            <Label>Start Date - End Date</Label>
                            <div className="flex gap-2">
                                <Input name="startDate" value={exp.startDate} onChange={(e) => handleItemChange('experience', index, e)} />
                                <Input name="endDate" value={exp.endDate} onChange={(e) => handleItemChange('experience', index, e)} />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea name="description" value={exp.description} onChange={(e) => handleItemChange('experience', index, e)} />
                    </div>
                  </div>
                ))}
                 <Button variant="outline" onClick={() => handleAddItem<Experience>('experience', { title: '', company: '', location: '', startDate: '', endDate: '', description: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
                </Button>
                <Separator />
                <Button onClick={() => handleSave("Experience")} disabled={isSaving} className="bg-accent hover:bg-accent/90">
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : 'Save & Next'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="education">
             {/* Similar editable fields for education */}
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Education</CardTitle>
                    <CardDescription>List your academic background.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {data.education.map((edu, index) => (
                        <div key={edu.id} className="p-4 border rounded-md relative space-y-4">
                             <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveItem('education', edu.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div className="space-y-2">
                                    <Label>Degree</Label>
                                    <Input name="degree" value={edu.degree} onChange={(e) => handleItemChange('education', index, e)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Institution</Label>
                                    <Input name="institution" value={edu.institution} onChange={(e) => handleItemChange('education', index, e)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input name="location" value={edu.location} onChange={(e) => handleItemChange('education', index, e)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Start Date - End Date</Label>
                                    <div className="flex gap-2">
                                        <Input name="startDate" value={edu.startDate} onChange={(e) => handleItemChange('education', index, e)} />
                                        <Input name="endDate" value={edu.endDate} onChange={(e) => handleItemChange('education', index, e)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => handleAddItem<Education>('education', { degree: '', institution: '', location: '', startDate: '', endDate: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Education
                    </Button>
                    <Separator />
                    <Button onClick={() => handleSave("Education")} disabled={isSaving} className="bg-accent hover:bg-accent/90">
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : 'Save & Next'}
                    </Button>
                </CardContent>
             </Card>
          </TabsContent>

           <TabsContent value="projects">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Projects</CardTitle>
                    <CardDescription>Showcase your work.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {data.projects.map((proj, index) => (
                        <div key={proj.id} className="p-4 border rounded-md relative space-y-4">
                             <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveItem('projects', proj.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Project Name</Label>
                                    <Input name="name" value={proj.name} onChange={(e) => handleItemChange('projects', index, e)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>URL</Label>
                                    <Input name="url" value={proj.url} onChange={(e) => handleItemChange('projects', index, e)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea name="description" value={proj.description} onChange={(e) => handleItemChange('projects', index, e)} />
                            </div>
                             <div className="space-y-2">
                                <Label>Tags (comma-separated)</Label>
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
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                    </Button>
                    <Separator />
                    <Button onClick={() => handleSave("Projects")} disabled={isSaving} className="bg-accent hover:bg-accent/90">
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : 'Save & Next'}
                    </Button>
                </CardContent>
            </Card>
          </TabsContent>

           <TabsContent value="certifications">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Certifications</CardTitle>
                    <CardDescription>List any certs you have.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {data.certifications.map((cert, index) => (
                        <div key={cert.id} className="p-4 border rounded-md relative space-y-4">
                             <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveItem('certifications', cert.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Certification Name</Label>
                                    <Input name="name" value={cert.name} onChange={(e) => handleItemChange('certifications', index, e)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Issuer</Label>
                                    <Input name="issuer" value={cert.issuer} onChange={(e) => handleItemChange('certifications', index, e)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input name="date" value={cert.date} onChange={(e) => handleItemChange('certifications', index, e)} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => handleAddItem<Certification>('certifications', { name: '', issuer: '', date: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Certification
                    </Button>
                    <Separator />
                    <Button onClick={() => handleSave("Certifications")} disabled={isSaving} className="bg-accent hover:bg-accent/90">
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : 'Finish'}
                    </Button>
                </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
