import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Générateur de code de déblocage IMEI — TECHNO TR118",
  description:
    "Calcul local, dans le navigateur, des deux codes NCK du modem TECHNO TR118 (Orange AirBox) à partir de l'IMEI.",
  icons: { icon: "/favicon.svg" },
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
