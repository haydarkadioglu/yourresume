
"use client";

import { useState, useEffect } from "react";
import type { ResumeData } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, ArrowRight, Save } from "lucide-react";
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getResumeData, saveResumeData } from "@/lib/firestore";
import { useLanguage } from "@/context/LanguageContext";
import { mockResumeData } from "@/lib/mock-data";

const ALL_SECTIONS = ['skills', 'experience', 'education', 'projects', 'certifications'];
const SIDEBAR_ELIGIBLE = ['skills', 'education', 'certifications'];
const MAIN_ELIGIBLE = ['experience', 'projects'];

export default function LayoutEditorPage() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [layout, setLayout] = useState<{ sidebar: string[], main: string[] }>({ sidebar: SIDEBAR_ELIGIBLE, main: MAIN_ELIGIBLE });

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
          setData(resumeData);
          if (resumeData.layout) {
            setLayout(resumeData.layout);
          } else {
            setLayout({ sidebar: SIDEBAR_ELIGIBLE, main: MAIN_ELIGIBLE });
          }
        } else {
          // Should not happen if user is logged in, but as a fallback
          setData(mockResumeData);
          setLayout({ sidebar: SIDEBAR_ELIGIBLE, main: MAIN_ELIGIBLE });
        }
      };
      fetchData();
    }
  }, [user]);

  const moveSection = (section: string, from: 'sidebar' | 'main', to: 'sidebar' | 'main') => {
    setLayout(prev => {
      const newLayout = { ...prev };
      newLayout[from] = newLayout[from].filter(s => s !== section);
      // Ensure no duplicates
      if (!newLayout[to].includes(section)) {
        newLayout[to] = [...newLayout[to], section];
      }
      return newLayout;
    });
  };

  const handleSaveLayout = async () => {
    if (!user || !data) return;
    setIsSaving(true);
    
    const updatedData = { ...data, layout: layout };
    const result = await saveResumeData(user.uid, updatedData);

    if (result.success) {
      toast({
        title: t('saveAppearance'),
        description: "Your layout has been saved.",
      });
    } else {
      toast({
        variant: "destructive",
        title: t('saveError'),
        description: t(result.message as any) || result.message,
      });
    }
    setIsSaving(false);
  };


  if (authLoading || !user || !data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  const mainContentSections = ALL_SECTIONS.filter(s => !layout.sidebar.includes(s));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-card border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-headline text-primary">{t('layoutEditor')}</h1>
            <p className="text-sm text-muted-foreground">{t('layoutEditorDesc')}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard">{t('backToDashboard')}</Link>
            </Button>
            <Button onClick={handleSaveLayout} disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
              {t('saveLayout')}
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-8">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>{t('customizeLayout')}</CardTitle>
                <CardDescription>{t('customizeLayoutDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Main Content Column */}
                    <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="font-semibold text-lg mb-4 text-center">{t('mainContent')}</h3>
                        <div className="space-y-3 min-h-[200px] p-2 bg-background rounded-md border border-dashed">
                             {mainContentSections.map(section => (
                                <div key={section} className="flex items-center justify-between p-3 bg-muted rounded-md text-sm shadow-sm">
                                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => moveSection(section, 'main', 'sidebar')}>
                                    <ArrowLeft className="h-5 w-5" />
                                  </Button>
                                  <span className="font-medium">{t(section as any)}</span>
                                  <div className="w-8"></div>
                                </div>
                             ))}
                             {mainContentSections.length === 0 && (
                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                    <p>{t('mainContentEmpty')}</p>
                                </div>
                             )}
                        </div>
                    </div>
                    {/* Sidebar Column */}
                    <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="font-semibold text-lg mb-4 text-center">{t('sidebar')}</h3>
                        <div className="space-y-3 min-h-[200px] p-2 bg-background rounded-md border border-dashed">
                            {layout.sidebar.map(section => (
                                <div key={section} className="flex items-center justify-between p-3 bg-muted rounded-md text-sm shadow-sm">
                                   <div className="w-8"></div>
                                  <span className="font-medium">{t(section as any)}</span>
                                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => moveSection(section, 'sidebar', 'main')}>
                                    <ArrowRight className="h-5 w-5" />
                                  </Button>
                                </div>
                            ))}
                            {layout.sidebar.length === 0 && (
                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                    <p>{t('sidebarEmpty')}</p>
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
        <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">{t('layoutEditorNote')}</p>
        </div>
      </main>
    </div>
  );
}
