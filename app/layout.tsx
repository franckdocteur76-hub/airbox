import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

const SITE_URL = "https://onetechk.vercel.app";
const TITLE = "Générateur de code NCK — TECHNO TR118 | OneTechk";
const DESCRIPTION =
  "Calculez les deux codes NCK du modem TECHNO TR118 (Orange AirBox) à partir de l'IMEI. Calcul local, gratuit, sans inscription. Un outil OneTechk.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "OneTechk",
  authors: [{ name: "OneTechk", url: "https://www.youtube.com/@OneTechk" }],
  creator: "OneTechk",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "OneTechk",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#070b16",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
