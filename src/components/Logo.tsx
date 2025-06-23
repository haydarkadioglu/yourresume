import Link from "next/link";
import { FileSignature } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <FileSignature className="h-6 w-6 text-primary" />
      <span className="font-bold text-lg font-headline">YourResume</span>
    </Link>
  );
}
