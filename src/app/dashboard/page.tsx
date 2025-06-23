"use client";

import { useState, useEffect } from "react";
import { mockResumeData } from "@/lib/mock-data";
import type { ResumeData, Experience, Education, Project, Certification } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Trash2, PlusCircle } from "lucide-react";
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function DashboardPage() {
  const [data, setData] = useState<ResumeData>(mockResumeData);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  const handleLogout = async () => {
    await signOut(auth);
    toast({ title: "Logged out successfully" });
    router.push('/login');
  };


  const handleSave = (section: string) => {
    // In a real app, this would be a server action to save the data.
    console.log(`Saving ${section}`, data);
    toast({
      title: `${section} Saved`,
      description: `Your ${section.toLowerCase()} information has been updated.`,
    });
  };

  const handleAddItem = <T extends { id: string }>(
    field: keyof ResumeData,
    newItem: Omit<T, "id">
  ) => {
    setData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as T[]), { ...newItem, id: crypto.randomUUID() }],
    }));
  };

  const handleRemoveItem = (field: keyof ResumeData, id: string) => {
    setData((prev) => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((item) => item.id !== id),
    }));
  };
  
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
        ...prev,
        personalInfo: {
            ...prev.personalInfo,
            [name]: value,
        }
    }))
  }

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <header className="bg-card border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold font-headline text-primary">Dashboard</h1>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/cv/${user.uid}`} target="_blank">View My CV</Link>
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-8">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-6">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="certifications">Certs</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Personal Information</CardTitle>
                <CardDescription>This information will appear at the top of your resume.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Input id="email" name="email" type="email" value={data.personalInfo.email} onChange={handlePersonalInfoChange} />
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
                <Button onClick={() => handleSave("Personal Info")} className="bg-accent hover:bg-accent/90">Save Personal Info</Button>
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
                  onChange={(e) => setData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }))}
                  rows={4}
                />
                <Button onClick={() => handleSave("Skills")} className="bg-accent hover:bg-accent/90">Save Skills</Button>
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
                  <div key={exp.id} className="p-4 border rounded-md relative">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveItem('experience', exp.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Form fields for each experience item */}
                    </div>
                    <p className="font-semibold mt-2">{exp.company} - {exp.title}</p>
                  </div>
                ))}
                 <Button variant="outline" onClick={() => handleAddItem<Experience>('experience', { title: '', company: '', location: '', startDate: '', endDate: '', description: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
                </Button>
                <Separator />
                <Button onClick={() => handleSave("Experience")} className="bg-accent hover:bg-accent/90">Save Experience</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Education</CardTitle>
                <CardDescription>List your academic background.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {data.education.map((edu) => (
                   <div key={edu.id} className="p-4 border rounded-md relative">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveItem('education', edu.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                     <p className="font-semibold mt-2">{edu.institution} - {edu.degree}</p>
                   </div>
                ))}
                <Button variant="outline" onClick={() => handleAddItem<Education>('education', { degree: '', institution: '', location: '', startDate: '', endDate: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Education
                </Button>
                <Separator />
                <Button onClick={() => handleSave("Education")} className="bg-accent hover:bg-accent/90">Save Education</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Repeat for Projects and Certifications */}
           <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Projects</CardTitle>
                <CardDescription>Showcase your personal or professional projects.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {data.projects.map((proj) => (
                   <div key={proj.id} className="p-4 border rounded-md relative">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveItem('projects', proj.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                     <p className="font-semibold mt-2">{proj.name}</p>
                   </div>
                ))}
                <Button variant="outline" onClick={() => handleAddItem<Project>('projects', { name: '', description: '', url: '', tags: [] })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                </Button>
                <Separator />
                <Button onClick={() => handleSave("Projects")} className="bg-accent hover:bg-accent/90">Save Projects</Button>
              </CardContent>
            </Card>
          </TabsContent>

           <TabsContent value="certifications">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Certifications</CardTitle>
                <CardDescription>List any certifications you have earned.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {data.certifications.map((cert) => (
                   <div key={cert.id} className="p-4 border rounded-md relative">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveItem('certifications', cert.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                     <p className="font-semibold mt-2">{cert.name}</p>
                   </div>
                ))}
                <Button variant="outline" onClick={() => handleAddItem<Certification>('certifications', { name: '', issuer: '', date: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Certification
                </Button>
                <Separator />
                <Button onClick={() => handleSave("Certifications")} className="bg-accent hover:bg-accent/90">Save Certifications</Button>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
