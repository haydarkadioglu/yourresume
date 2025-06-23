import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm bg-card no-print">
      <div className="container mx-auto flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4 sm:gap-6">
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
