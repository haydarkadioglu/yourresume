
"use client";

import { useState, useEffect } from "react";
import type { ResumeData } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, ArrowRight, Save, ArrowUp, ArrowDown } from "lucide-react";
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getResumeData, saveResumeData } from "@/lib/firestore";
import { useLanguage } from "@/context/LanguageContext";
import { mockResumeData } from "@/lib/mock-data";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const ALL_SECTIONS = ['skills', 'experience', 'education', 'projects', 'certifications'];
const DEFAULT_LAYOUT = { sidebar: ['skills', 'education', 'certifications'], main: ['experience', 'projects'] };
const DEFAULT_SECTION_ORDER = ['skills', 'experience', 'education', 'projects', 'certifications'];

export default function LayoutEditorPage() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'single' | 'two'>('two');
  
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
        if (!resumeData) {
            resumeData = {
                ...mockResumeData,
                personalInfo: {
                    ...mockResumeData.personalInfo,
                    email: user.email || '',
                    username: '',
                    template: 'classic',
                },
                sectionOrder: DEFAULT_SECTION_ORDER,
                layout: DEFAULT_LAYOUT,
            }
        }
        
        // Ensure all sections are accounted for, adding new ones to main/default order
        const existingLayoutSections = new Set([...(resumeData.layout?.sidebar || []), ...(resumeData.layout?.main || [])]);
        const newLayoutSections = ALL_SECTIONS.filter(s => !existingLayoutSections.has(s));
        
        const existingOrderSections = new Set(resumeData.sectionOrder || []);
        const newOrderSections = ALL_SECTIONS.filter(s => !existingOrderSections.has(s));

        resumeData.layout = {
            sidebar: resumeData.layout?.sidebar || DEFAULT_LAYOUT.sidebar,
            main: [...(resumeData.layout?.main || DEFAULT_LAYOUT.main), ...newLayoutSections]
        };
        resumeData.sectionOrder = [...(resumeData.sectionOrder || DEFAULT_SECTION_ORDER), ...newOrderSections];

        setData(resumeData);

        // Determine initial layout mode
        if (!resumeData.layout.sidebar || resumeData.layout.sidebar.length === 0) {
            setLayoutMode('single');
        } else {
            setLayoutMode('two');
        }
      };
      fetchData();
    }
  }, [user]);

  const moveBetweenColumns = (section: string, from: 'sidebar' | 'main', to: 'sidebar' | 'main') => {
    setData(prev => {
      if (!prev || !prev.layout) return prev;
      const newLayout = { ...prev.layout };
      newLayout[from] = newLayout[from].filter(s => s !== section);
      if (!newLayout[to].includes(section)) {
        newLayout[to] = [...newLayout[to], section];
      }
      return { ...prev, layout: newLayout };
    });
  };

  const moveInSectionOrder = (sectionKey: string, direction: 'up' | 'down') => {
    setData(prev => {
      if (!prev || !prev.sectionOrder) return prev;

      const order = [...prev.sectionOrder];
      const index = order.indexOf(sectionKey);
      if (index === -1) return prev;
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= order.length) return prev;
      
      const temp = order[index];
      order[index] = order[newIndex];
      order[newIndex] = temp;

      return { ...prev, sectionOrder: order };
    });
  };

  const handleSaveLayout = async () => {
    if (!user || !data) return;
    setIsSaving(true);
    
    let dataToSave = { ...data };

    if (layoutMode === 'single') {
        // In single column mode, all sections go to 'main', sidebar is empty
        dataToSave.layout = {
            main: [...ALL_SECTIONS],
            sidebar: []
        };
    }

    const result = await saveResumeData(user.uid, dataToSave);

    if (result.success) {
      toast({
        title: t('saveLayout'),
        description: t('layoutSavedSuccess'),
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


  if (authLoading || !user || !data || !data.layout || !data.sectionOrder) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const orderedMain = data.sectionOrder.filter(s => data.layout?.main.includes(s));
  const orderedSidebar = data.sectionOrder.filter(s => data.layout?.sidebar.includes(s));
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-card border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-headline text-primary">{t('layoutAndOrder')}</h1>
            <p className="text-sm text-muted-foreground">{t('layoutAndOrderDesc')}</p>
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
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold font-headline">{t('customizeLayout')}</CardTitle>
                <CardDescription className="max-w-3xl mx-auto mt-2">{t('customizeLayoutDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center mb-8">
                    <RadioGroup value={layoutMode} onValueChange={(v) => setLayoutMode(v as any)} className="grid grid-cols-2 gap-4">
                        <div>
                            <RadioGroupItem value="single" id="single" className="peer sr-only" />
                            <Label htmlFor="single" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                {t('singleColumn')}
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="two" id="two" className="peer sr-only" />
                            <Label htmlFor="two" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                {t('twoColumnLayout')}
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {layoutMode === 'single' && (
                    <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 max-w-xl mx-auto">
                        <h3 className="font-semibold text-lg mb-4 text-center">{t('sectionOrder')}</h3>
                        <p className="text-center text-sm text-muted-foreground mb-4">{t('sectionOrderDesc')}</p>
                        <div className="space-y-3 p-2 bg-background rounded-md border border-dashed">
                            {data.sectionOrder.map((section, index) => (
                                <div key={section} className="flex items-center justify-between p-3 bg-muted rounded-md text-sm shadow-sm">
                                    <span className="font-medium capitalize">{t(section as any)}</span>
                                    <div className="flex gap-1">
                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => moveInSectionOrder(section, 'up')} disabled={index === 0}>
                                            <ArrowUp className="h-5 w-5" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => moveInSectionOrder(section, 'down')} disabled={index === data.sectionOrder.length - 1}>
                                            <ArrowDown className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {layoutMode === 'two' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Main Content Column */}
                        <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <h3 className="font-semibold text-lg mb-4 text-center">{t('mainContent')}</h3>
                            <div className="space-y-3 min-h-[200px] p-2 bg-background rounded-md border border-dashed">
                                {orderedMain.map(section => (
                                    <div key={section} className="flex items-center justify-between p-3 bg-muted rounded-md text-sm shadow-sm">
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => moveBetweenColumns(section, 'main', 'sidebar')}>
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                    <span className="font-medium capitalize">{t(section as any)}</span>
                                    <div className="w-8"></div>
                                    </div>
                                ))}
                                {orderedMain.length === 0 && (
                                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-4">
                                        <p>{t('mainContentEmpty')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Sidebar Column */}
                        <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <h3 className="font-semibold text-lg mb-4 text-center">{t('sidebar')}</h3>
                            <div className="space-y-3 min-h-[200px] p-2 bg-background rounded-md border border-dashed">
                                {orderedSidebar.map(section => (
                                    <div key={section} className="flex items-center justify-between p-3 bg-muted rounded-md text-sm shadow-sm">
                                    <div className="w-8"></div>
                                    <span className="font-medium capitalize">{t(section as any)}</span>
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => moveBetweenColumns(section, 'sidebar', 'main')}>
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>
                                    </div>
                                ))}
                                {orderedSidebar.length === 0 && (
                                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-4">
                                        <p>{t('sidebarEmpty')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                 <div className="mt-8 text-center">
                    <p className="text-lg font-medium text-primary">
                        {t('saveReminder')}
                    </p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
