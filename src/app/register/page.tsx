"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { saveLoginHistory, saveResumeData, getResumeData } from "@/lib/firestore";
import { mockResumeData } from "@/lib/mock-data";


// Helper function from login page
function getOS(userAgent: string): string {
    if (/windows/i.test(userAgent)) return "Windows";
    if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
    if (/mac/i.test(userAgent)) return "macOS";
    if (/android/i.test(userAgent)) return "Android";
    if (/linux/i.test(userAgent)) return "Linux";
    return "Unknown";
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      if (user) {
        // Check if user data already exists, if not, create it
        const existingData = await getResumeData(user.uid);
        if (!existingData) {
          const initialData = {
            ...mockResumeData,
            personalInfo: {
              ...mockResumeData.personalInfo,
              name: user.displayName || "",
              email: user.email || "",
              template: 'classic',
              username: ''
            },
            sectionOrder: ['skills', 'experience', 'education', 'projects', 'certifications'],
          };
          await saveResumeData(user.uid, initialData);
        }

         try {
          const ipRes = await fetch("https://api.ipify.org?format=json");
          const ipData = await ipRes.json();
          await saveLoginHistory(user.uid, {
            ipAddress: ipData.ip || "N/A",
            userAgent: navigator.userAgent,
            os: getOS(navigator.userAgent),
          });
        } catch (activityError) {
           await saveLoginHistory(user.uid, {
            ipAddress: "N/A",
            userAgent: navigator.userAgent,
            os: getOS(navigator.userAgent),
          });
          console.error("Could not log user activity:", activityError);
        }
      }

      toast({
        title: t('registrationSuccess'),
        description: t('registrationSuccessDesc'),
      });
      router.push("/dashboard");

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('registrationFailed'),
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      if (user) {
        // Create initial resume data
        const initialData = {
           ...mockResumeData,
            personalInfo: {
              ...mockResumeData.personalInfo,
              name: values.name,
              email: user.email || "",
              template: 'classic',
              username: '',
            },
            sectionOrder: ['skills', 'experience', 'education', 'projects', 'certifications'],
        };
        await saveResumeData(user.uid, initialData);

         try {
          const ipRes = await fetch("https://api.ipify.org?format=json");
          const ipData = await ipRes.json();
          await saveLoginHistory(user.uid, {
            ipAddress: ipData.ip || "N/A",
            userAgent: navigator.userAgent,
            os: getOS(navigator.userAgent),
          });
        } catch (activityError) {
           await saveLoginHistory(user.uid, {
            ipAddress: "N/A",
            userAgent: navigator.userAgent,
            os: getOS(navigator.userAgent),
          });
          console.error("Could not log user activity:", activityError);
        }
      }

      toast({
        title: t('registrationSuccess'),
        description: t('registrationSuccessDesc'),
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('registrationFailed'),
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle className="font-headline text-2xl">{t('registerTitle')}</CardTitle>
          <CardDescription>{t('registerDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={isLoading}>
              {isLoading ? t('loggingIn') : t('signUpWithGoogle')}
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                    {t('orContinueWith')}
                    </span>
                </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('fullName')}</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email')}</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('password')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} disabled={isLoading}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/80" disabled={isLoading}>
                  {isLoading ? t('loggingIn') : t('register')}
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
        <div className="text-center p-6 pt-0 text-sm text-muted-foreground">
          {t('haveAccount')}
          <Button variant="link" asChild className="p-0 h-auto ml-1">
            <Link href="/login">{t('login')}</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
