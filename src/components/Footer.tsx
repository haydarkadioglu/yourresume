"use client";

import { Logo } from "./Logo";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-8 no-print">
      <div className="container mx-auto px-4 lg:px-6 flex flex-col md:flex-row items-center justify-between">
        <Logo />
        <p className="text-sm text-muted-foreground mt-4 md:mt-0">
          © {currentYear} YourResume. All rights reserved.
        </p>
        <div className="flex gap-4 mt-4 md:mt-0">
            <Link className="text-sm text-muted-foreground hover:text-primary" href="#">{t('privacy')}</Link>
            <Link className="text-sm text-muted-foreground hover:text-primary" href="#">{t('terms')}</Link>
        </div>
      </div>
    </footer>
  );
}
