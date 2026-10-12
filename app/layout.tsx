import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { profile } from "@/data/profile";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const fullName = `${profile.firstName} ${profile.lastName}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${fullName} — ${profile.role} | ${siteName}`,
    template: `%s · ${fullName} | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: fullName }],
  keywords: [
    "administration systèmes",
    "informatique ES",
    "systèmes et exploitation",
    "Active Directory",
    "GPO",
    "Windows",
    "Linux",
    "réseaux",
    "virtualisation",
    "homelab",
    "cybersécurité",
    "portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_CH",
    url: "/",
    siteName,
    title: `${fullName} — ${profile.role}`,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${fullName} — ${profile.role}`,
    description: siteDescription,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0E0C",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr" className={`${grotesk.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
