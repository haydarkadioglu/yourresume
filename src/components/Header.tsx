import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm bg-card no-print">
      <div className="container mx-auto flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-4">
           <ThemeToggle />
           <Button asChild variant="secondary">
            <Link href="/login">
              Login
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
