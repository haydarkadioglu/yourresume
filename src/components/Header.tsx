"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { t } = useLanguage();
  const { user, loading } = useAuth();

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm bg-card no-print">
      <div className="container mx-auto flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-4">
           <Button variant="link" asChild className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <Link href="/">{t('home')}</Link>
           </Button>
           <Button variant="link" asChild className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
             <Link href="/contact">{t('contact')}</Link>
           </Button>
           <LanguageSwitcher />
           <ThemeToggle />
           {!loading &&
            (!user ? (
                <>
                  <Button asChild variant="ghost">
                    <Link href="/login">{t('login')}</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">{t('register')}</Link>
                  </Button>
                </>
              ) : (
                <Button asChild variant="outline">
                  <Link href="/dashboard">{t('dashboard')}</Link>
                </Button>
              ))
           }
        </nav>
      </div>
    </header>
  );
}
