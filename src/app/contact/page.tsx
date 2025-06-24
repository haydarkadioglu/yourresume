import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Github, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-12 md:py-24 lg:py-32 px-4 md:px-6">
        <div className="flex justify-center">
            <Card className="w-full max-w-5xl shadow-2xl rounded-xl overflow-hidden">
                <div className="relative h-[450px] md:h-[550px]">
                    <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://maps.google.com/maps?q=Hacettepe%20Teknokent%20Ankara&t=&z=14&ie=UTF8&iwloc=&output=embed"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    
                    <div className="absolute top-4 left-4 md:top-8 md:left-8">
                        <Card className="w-full max-w-sm bg-card/90 backdrop-blur-sm border-primary/20">
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl flex items-center gap-2"><MapPin className="h-6 w-6 text-primary" /> İletişim</CardTitle>
                                <CardDescription>
                                    Hacettepe Teknokent, Ankara, Türkiye
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Link href="mailto:info@notiral.com" className="flex items-center gap-3 text-base hover:text-primary transition-colors">
                                    <Mail className="h-5 w-5" />
                                    <span>info@notiral.com</span>
                                </Link>
                                <Link href="https://github.com/haydarkadioglu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-base hover:text-primary transition-colors">
                                    <Github className="h-5 w-5" />
                                    <span>github.com/haydarkadioglu</span>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
