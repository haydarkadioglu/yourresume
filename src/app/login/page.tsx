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
import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { saveLoginHistory } from "@/lib/firestore";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

function getOS(userAgent: string): string {
    if (/windows/i.test(userAgent)) return "Windows";
    if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
    if (/mac/i.test(userAgent)) return "macOS";
    if (/android/i.test(userAgent)) return "Android";
    if (/linux/i.test(userAgent)) return "Linux";
    return "Unknown";
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // Log activity after successful login
      if (user) {
        try {
          const ipRes = await fetch("https://api.ipify.org?format=json");
          const ipData = await ipRes.json();
          const ipAddress = ipData.ip || "IP Not Found";
          const userAgent = navigator.userAgent;
          const os = getOS(userAgent);
          
          await saveLoginHistory(user.uid, {
            ipAddress: ipAddress,
            userAgent: userAgent,
            os: os,
          });

        } catch (activityError) {
           // Log IP as N/A if the fetch fails, but still log the login
           const userAgent = navigator.userAgent;
           const os = getOS(userAgent);
           await saveLoginHistory(user.uid, {
            ipAddress: "N/A",
            userAgent: userAgent,
            os: os,
          });
          console.error("Could not log user activity:", activityError);
          // Don't block login if activity logging fails
        }
      }

      toast({
        title: t('loginSuccess'),
        description: t('loginSuccessDesc'),
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('loginFailed'),
        description: t('loginFailedDesc'),
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
          <CardTitle className="font-headline text-2xl">{t('welcomeBack')}</CardTitle>
          <CardDescription>{t('welcomeBackDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
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
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-accent hover:bg-accent/80" disabled={isLoading}>
                {isLoading ? t('loggingIn') : t('login')}
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className="text-center p-6 pt-0 text-sm text-muted-foreground">
          {t('newUserDisabled')}
          <br />
          <Button variant="link" asChild className="p-0 h-auto mt-2">
            <Link href="/">{t('backToHome')}</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
