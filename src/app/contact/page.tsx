import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Github, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-12 md:py-24 px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl md:text-5xl">İletişime Geçin</h1>
            <p className="mt-4 max-w-[700px] text-muted-foreground md:text-xl">Sorularınız, önerileriniz veya işbirliği teklifleriniz için bize ulaşmaktan çekinmeyin.</p>
        </div>

        <div className="flex flex-col items-center gap-12">
            {/* Contact Info Card */}
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2"><MapPin className="h-6 w-6 text-primary" /> İletişim Bilgileri</CardTitle>
                    <CardDescription>
                        Türkiye
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-left">
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

            {/* Map */}
            <div className="w-full max-w-5xl h-[450px] rounded-xl overflow-hidden shadow-2xl">
                <iframe
                    className="w-full h-full"
                    src="https://maps.google.com/maps?q=Turkey&t=&z=6&ie=UTF8&iwloc=&output=embed"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}