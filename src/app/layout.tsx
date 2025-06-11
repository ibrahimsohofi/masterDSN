import type { Metadata } from "next";
import { Inter, Fira_Mono } from "next/font/google";
import "./globals.css";
import NavigationTemp from "@/components/Navigation-temp";
// import Navigation from "@/components/Navigation";
// import { ClerkProvider } from "@clerk/nextjs";
// import { dark } from "@clerk/themes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaMono = Fira_Mono({
  variable: "--font-fira-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Master DSN - Plateforme collaborative",
  description:
    "Plateforme de valorisation et de partage des travaux académiques du Master Droit et Sécurité Numériques",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${inter.variable} ${firaMono.variable} antialiased bg-slate-900 text-white`}
      >
        <NavigationTemp />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
