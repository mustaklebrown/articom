import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "KOMO-ART | La Marketplace des Artisans Comoriens",
  description:
    "Découvrez et commandez les créations d'exception des artisans des Comores : menuiserie, chiromani, bijoux, maroquinerie, vannerie et cosmétique naturelle.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${jakarta.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8F8F6] text-[#0F2C4C] selection:bg-[#D96B27]/20 selection:text-[#0F2C4C]">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
