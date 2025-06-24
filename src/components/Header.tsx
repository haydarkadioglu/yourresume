import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm bg-card no-print">
      <div className="container mx-auto flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4 sm:gap-6">
           <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
             Anasayfa
           </Link>
           <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
             İletişim
           </Link>
           <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
