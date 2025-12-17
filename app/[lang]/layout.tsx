import "../globals.css";
// 1. Import Amita
import { Cinzel, Merriweather, Amita } from "next/font/google"; 
import type { Metadata } from "next";
import BottomNav from "@/components/BottomNav";

const cinzel = Cinzel({ 
  subsets: ["latin"], 
  variable: "--font-heading",
  weight: ["400", "700", "900"] 
});

const merriweather = Merriweather({ 
  subsets: ["latin"], 
  variable: "--font-body",
  weight: ["300", "400", "700", "900"]
});

// 2. Configure Amita
const amita = Amita({
  subsets: ["devanagari", "latin"],
  variable: "--font-sanskrit",
  weight: ["400", "700"]
});

// ... metadata ...

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    // 3. Add amita.variable to the class list
    <html lang={lang} className={`${cinzel.variable} ${merriweather.variable} ${amita.variable}`}>
      <body className="font-body bg-saffron-base text-saffron-text antialiased pb-24">
        <div className="h-2 w-full bg-gradient-to-r from-saffron-text via-saffron-strong to-saffron-text" />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}