"use client";

import { useState, useEffect } from "react";
import type { ResumeData } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Save, Eye, Palette, Type, Layout } from "lucide-react";
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getResumeData, saveResumeData } from "@/lib/firestore";
import { useLanguage } from "@/context/LanguageContext";
import { mockResumeData } from "@/lib/mock-data";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface CustomTemplate {
  id: string;
  name: string;
  layout: 'single' | 'two-column' | 'three-column';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'relaxed';
  headerStyle: 'centered' | 'left-aligned' | 'right-aligned';
  sectionStyle: 'minimal' | 'bordered' | 'colored-headers';
  showIcons: boolean;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  pageMargin: 'tight' | 'normal' | 'wide';
  sectionOrder: string[];
  columnConfig?: {
    leftColumn: string[];
    centerColumn?: string[];
    rightColumn: string[];
  };
}

const FONT_FAMILIES = [
  { value: 'sans', label: 'Sans Serif', class: 'font-sans' },
  { value: 'serif', label: 'Serif', class: 'font-serif' },
  { value: 'mono', label: 'Monospace', class: 'font-mono' }
];

const PREDEFINED_COLORS = [
  { name: 'Professional Blue', value: "217 91% 60%" },
  { name: 'Corporate Purple', value: "262 52% 47%" },
  { name: 'Success Green', value: "142 76% 36%" },
  { name: 'Energy Orange', value: "24 98% 52%" },
  { name: 'Modern Red', value: "0 84% 60%" },
  { name: 'Creative Pink', value: "330 84% 60%" },
  { name: 'Classic Gray', value: "240 6% 10%" }
];

const DEFAULT_SECTIONS = ['summary', 'skills', 'experience', 'education', 'projects', 'certifications'];

export default function TemplateBuilderPage() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [customTemplate, setCustomTemplate] = useState<CustomTemplate>({
    id: 'custom',
    name: 'My Custom Template',
    layout: 'two-column',
    primaryColor: "217 91% 60%",
    secondaryColor: "240 6% 10%",
    fontFamily: 'sans',
    fontSize: 'medium',
    spacing: 'normal',
    headerStyle: 'left-aligned',
    sectionStyle: 'minimal',
    showIcons: true,
    borderRadius: 'small',
    pageMargin: 'normal',
    sectionOrder: DEFAULT_SECTIONS,
    columnConfig: {
      leftColumn: ['contact', 'skills', 'education'],
      rightColumn: ['summary', 'experience', 'projects', 'certifications']
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('layout');

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
              template: 'custom' as any,
            },
            sectionOrder: DEFAULT_SECTIONS,
            customSections: []
          };
        }
        setData(resumeData);
        
        // If user has an existing custom template, load it
        if (resumeData.customTemplate) {
          setCustomTemplate(resumeData.customTemplate);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleSaveTemplate = async () => {
    if (!user || !data) return;
    setIsSaving(true);
    
    // Update resume data with custom template settings
    const updatedData = {
      ...data,
      personalInfo: {
        ...data.personalInfo,
        template: 'custom' as any,
        themeColor: customTemplate.primaryColor
      },
      customTemplate,
      sectionOrder: customTemplate.sectionOrder,
      layout: customTemplate.layout === 'single' ? {
        main: customTemplate.sectionOrder,
        sidebar: []
      } : customTemplate.layout === 'two-column' && customTemplate.columnConfig ? {
        sidebar: customTemplate.columnConfig.leftColumn,
        main: customTemplate.columnConfig.rightColumn
      } : data.layout
    };

    const result = await saveResumeData(user.uid, updatedData);

    if (result.success) {
      toast({
        title: t('templateSaved'),
        description: t('templateSavedDesc'),
      });
      router.push('/dashboard?tab=appearance');
    } else {
      toast({
        variant: "destructive",
        title: t('saveError'),
        description: result.message,
      });
    }
    setIsSaving(false);
  };

  const updateCustomTemplate = (updates: Partial<CustomTemplate>) => {
    setCustomTemplate(prev => ({ ...prev, ...updates }));
  };

  const moveSection = (section: string, from: 'leftColumn' | 'rightColumn', to: 'leftColumn' | 'rightColumn') => {
    if (!customTemplate.columnConfig) return;
    
    const newConfig = { ...customTemplate.columnConfig };
    newConfig[from] = newConfig[from].filter(s => s !== section);
    if (!newConfig[to].includes(section)) {
      newConfig[to] = [...newConfig[to], section];
    }
    
    updateCustomTemplate({ columnConfig: newConfig });
  };

  const PreviewTemplate = () => {
    if (!data) return null;

    const fontClass = FONT_FAMILIES.find(f => f.value === customTemplate.fontFamily)?.class || 'font-sans';
    const spacingClass = customTemplate.spacing === 'compact' ? 'space-y-4' : 
                        customTemplate.spacing === 'relaxed' ? 'space-y-8' : 'space-y-6';
    const marginClass = customTemplate.pageMargin === 'tight' ? 'p-4' : 
                       customTemplate.pageMargin === 'wide' ? 'p-12' : 'p-8';
    const borderRadiusClass = customTemplate.borderRadius === 'none' ? 'rounded-none' :
                             customTemplate.borderRadius === 'small' ? 'rounded-md' :
                             customTemplate.borderRadius === 'large' ? 'rounded-xl' : 'rounded-lg';

    return (
      <div 
        className={cn("w-full max-w-4xl mx-auto bg-white shadow-lg print:shadow-none", borderRadiusClass, marginClass, fontClass)}
        style={{ '--primary-color': `hsl(${customTemplate.primaryColor})`, '--secondary-color': `hsl(${customTemplate.secondaryColor})` } as React.CSSProperties}
      >
        {/* Header */}
        <div className={cn("border-b pb-6 mb-6", 
          customTemplate.headerStyle === 'centered' ? 'text-center' : 
          customTemplate.headerStyle === 'right-aligned' ? 'text-right' : 'text-left'
        )}>
          <h1 className="text-3xl font-bold" style={{ color: `hsl(${customTemplate.primaryColor})` }}>
            {data.personalInfo.name || 'John Doe'}
          </h1>
          <p className="text-lg text-gray-600 mt-2">{data.personalInfo.title || 'Professional Title'}</p>
          <div className="flex gap-4 mt-4 justify-center">
            <span className="text-sm text-gray-600">{data.personalInfo.email || 'email@example.com'}</span>
            <span className="text-sm text-gray-600">{data.personalInfo.phone || '+1 (555) 123-4567'}</span>
          </div>
        </div>

        {/* Content */}
        <div className={cn(
          customTemplate.layout === 'single' ? 'space-y-6' : 'grid gap-8',
          customTemplate.layout === 'two-column' ? 'grid-cols-3' : 
          customTemplate.layout === 'three-column' ? 'grid-cols-3' : ''
        )}>
          {customTemplate.layout === 'single' ? (
            <div className={spacingClass}>
              {customTemplate.sectionOrder.map(section => (
                <SectionPreview key={section} section={section} />
              ))}
            </div>
          ) : customTemplate.layout === 'two-column' && customTemplate.columnConfig ? (
            <>
              <div className={cn("col-span-1", spacingClass)}>
                {customTemplate.columnConfig.leftColumn.map(section => (
                  <SectionPreview key={section} section={section} />
                ))}
              </div>
              <div className={cn("col-span-2", spacingClass)}>
                {customTemplate.columnConfig.rightColumn.map(section => (
                  <SectionPreview key={section} section={section} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    );
  };

  const SectionPreview = ({ section }: { section: string }) => {
    const getSectionContent = () => {
      switch (section) {
        case 'summary':
          return (
            <div>
              <SectionHeader title="Professional Summary" />
              <p className="text-sm text-gray-700">Experienced professional with a strong background in...</p>
            </div>
          );
        case 'skills':
          return (
            <div>
              <SectionHeader title="Skills" />
              <div className="flex flex-wrap gap-2">
                {['JavaScript', 'React', 'Node.js'].map(skill => (
                  <span key={skill} className="px-2 py-1 bg-gray-100 text-xs rounded">{skill}</span>
                ))}
              </div>
            </div>
          );
        case 'experience':
          return (
            <div>
              <SectionHeader title="Experience" />
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">Senior Developer</h4>
                  <p className="text-xs text-gray-600">Tech Company • 2020-Present</p>
                  <p className="text-xs text-gray-700 mt-1">Led development of key features...</p>
                </div>
              </div>
            </div>
          );
        default:
          return (
            <div>
              <SectionHeader title={section.charAt(0).toUpperCase() + section.slice(1)} />
              <p className="text-xs text-gray-700">Sample content for {section}...</p>
            </div>
          );
      }
    };

    return getSectionContent();
  };

  const SectionHeader = ({ title }: { title: string }) => {
    if (customTemplate.sectionStyle === 'minimal') {
      return <h3 className="text-sm font-semibold mb-2">{title}</h3>;
    } else if (customTemplate.sectionStyle === 'bordered') {
      return <h3 className="text-sm font-semibold mb-2 pb-1 border-b border-gray-200">{title}</h3>;
    } else {
      return (
        <h3 
          className="text-sm font-semibold mb-2 px-2 py-1 rounded text-white"
          style={{ backgroundColor: `hsl(${customTemplate.primaryColor})` }}
        >
          {title}
        </h3>
      );
    }
  };

  if (authLoading || !user || !data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-card border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-headline text-primary">Template Builder</h1>
            <p className="text-sm text-muted-foreground">Create your own unique CV template</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard?tab=appearance">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Appearance
              </Link>
            </Button>
            <Button onClick={handleSaveTemplate} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Template
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Template Editor */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5" />
                  Template Settings
                </CardTitle>
                <CardDescription>
                  Customize every aspect of your resume template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="layout">Layout</TabsTrigger>
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="typography">Typography</TabsTrigger>
                    <TabsTrigger value="style">Style</TabsTrigger>
                  </TabsList>

                  <TabsContent value="layout" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Layout Structure</Label>
                      <RadioGroup 
                        value={customTemplate.layout} 
                        onValueChange={(value: 'single' | 'two-column' | 'three-column') => 
                          updateCustomTemplate({ layout: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="single" id="single" />
                          <Label htmlFor="single">Single Column</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="two-column" id="two-column" />
                          <Label htmlFor="two-column">Two Column</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {customTemplate.layout === 'two-column' && customTemplate.columnConfig && (
                      <div className="space-y-4">
                        <Label className="text-base font-medium">Column Configuration</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Left Column (Sidebar)</Label>
                            <div className="space-y-2 p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                              {customTemplate.columnConfig.leftColumn.map(section => (
                                <div key={section} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded text-sm">
                                  <span className="capitalize">{section}</span>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => moveSection(section, 'leftColumn', 'rightColumn')}
                                  >
                                    →
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Right Column (Main)</Label>
                            <div className="space-y-2 p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                              {customTemplate.columnConfig.rightColumn.map(section => (
                                <div key={section} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded text-sm">
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => moveSection(section, 'rightColumn', 'leftColumn')}
                                  >
                                    ←
                                  </Button>
                                  <span className="capitalize">{section}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Page Margin</Label>
                      <RadioGroup 
                        value={customTemplate.pageMargin} 
                        onValueChange={(value: 'tight' | 'normal' | 'wide') => 
                          updateCustomTemplate({ pageMargin: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="tight" id="tight" />
                          <Label htmlFor="tight">Tight (More content)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="normal" id="normal" />
                          <Label htmlFor="normal">Normal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="wide" id="wide" />
                          <Label htmlFor="wide">Wide (More whitespace)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Primary Color</Label>
                      <div className="grid grid-cols-4 gap-3">
                        {PREDEFINED_COLORS.map(color => (
                          <button
                            key={color.value}
                            onClick={() => updateCustomTemplate({ primaryColor: color.value })}
                            className={cn(
                              "h-12 w-full rounded-md border-2 transition-all",
                              customTemplate.primaryColor === color.value ? 'border-ring ring-2 ring-ring' : 'border-transparent'
                            )}
                            style={{ backgroundColor: `hsl(${color.value})` }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Secondary Color</Label>
                      <div className="grid grid-cols-4 gap-3">
                        {PREDEFINED_COLORS.map(color => (
                          <button
                            key={color.value}
                            onClick={() => updateCustomTemplate({ secondaryColor: color.value })}
                            className={cn(
                              "h-12 w-full rounded-md border-2 transition-all",
                              customTemplate.secondaryColor === color.value ? 'border-ring ring-2 ring-ring' : 'border-transparent'
                            )}
                            style={{ backgroundColor: `hsl(${color.value})` }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="typography" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Font Family</Label>
                      <Select 
                        value={customTemplate.fontFamily} 
                        onValueChange={(value: 'sans' | 'serif' | 'mono') => 
                          updateCustomTemplate({ fontFamily: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FONT_FAMILIES.map(font => (
                            <SelectItem key={font.value} value={font.value}>
                              <span className={font.class}>{font.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Font Size</Label>
                      <RadioGroup 
                        value={customTemplate.fontSize} 
                        onValueChange={(value: 'small' | 'medium' | 'large') => 
                          updateCustomTemplate({ fontSize: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="small" id="small" />
                          <Label htmlFor="small">Small (Compact)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium">Medium</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="large" id="large" />
                          <Label htmlFor="large">Large (Readable)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Spacing</Label>
                      <RadioGroup 
                        value={customTemplate.spacing} 
                        onValueChange={(value: 'compact' | 'normal' | 'relaxed') => 
                          updateCustomTemplate({ spacing: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="compact" id="compact" />
                          <Label htmlFor="compact">Compact</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="normal" id="normal" />
                          <Label htmlFor="normal">Normal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="relaxed" id="relaxed" />
                          <Label htmlFor="relaxed">Relaxed</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </TabsContent>

                  <TabsContent value="style" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Header Style</Label>
                      <RadioGroup 
                        value={customTemplate.headerStyle} 
                        onValueChange={(value: 'centered' | 'left-aligned' | 'right-aligned') => 
                          updateCustomTemplate({ headerStyle: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="left-aligned" id="left-aligned" />
                          <Label htmlFor="left-aligned">Left Aligned</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="centered" id="centered" />
                          <Label htmlFor="centered">Centered</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="right-aligned" id="right-aligned" />
                          <Label htmlFor="right-aligned">Right Aligned</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Section Style</Label>
                      <RadioGroup 
                        value={customTemplate.sectionStyle} 
                        onValueChange={(value: 'minimal' | 'bordered' | 'colored-headers') => 
                          updateCustomTemplate({ sectionStyle: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="minimal" id="minimal" />
                          <Label htmlFor="minimal">Minimal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bordered" id="bordered" />
                          <Label htmlFor="bordered">Bordered</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="colored-headers" id="colored-headers" />
                          <Label htmlFor="colored-headers">Colored Headers</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Border Radius</Label>
                      <RadioGroup 
                        value={customTemplate.borderRadius} 
                        onValueChange={(value: 'none' | 'small' | 'medium' | 'large') => 
                          updateCustomTemplate({ borderRadius: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="none" />
                          <Label htmlFor="none">None (Sharp corners)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="small" id="small" />
                          <Label htmlFor="small">Small</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium">Medium</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="large" id="large" />
                          <Label htmlFor="large">Large (Rounded)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-icons" className="text-base font-medium">Show Icons</Label>
                      <Switch
                        id="show-icons"
                        checked={customTemplate.showIcons}
                        onCheckedChange={(checked) => updateCustomTemplate({ showIcons: checked })}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>
                  See how your template looks in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-white overflow-auto max-h-[800px]">
                  <div className="transform scale-75 origin-top-left w-[133%]">
                    <PreviewTemplate />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
