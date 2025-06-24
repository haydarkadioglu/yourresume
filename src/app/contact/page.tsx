import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Github, Mail } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-12 md:py-24 lg:py-32 px-4 md:px-6">
        <div className="flex justify-center">
          <Card className="w-full max-w-lg shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl">İletişim</CardTitle>
              <CardDescription>Benimle iletişime geçmek için aşağıdaki bilgileri kullanabilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="flex flex-col items-center gap-4">
                 <Link href="mailto:info@notiral.com" className="flex items-center gap-3 text-lg hover:text-primary transition-colors">
                  <Mail className="h-6 w-6" />
                  <span>info@notiral.com</span>
                </Link>
                <Link href="https://github.com/haydarkadioglu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg hover:text-primary transition-colors">
                  <Github className="h-6 w-6" />
                  <span>github.com/haydarkadioglu</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
